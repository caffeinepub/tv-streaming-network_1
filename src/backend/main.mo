import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Text "mo:core/Text";

actor {
  type Video = {
    id : Nat;
    title : Text;
    description : ?Text;
    youtubeUrl : Text;
    youtubeVideoId : Text;
    genre : Genre;
    isOriginal : Bool;
    createdAt : Int;
  };

  type Genre = {
    #comedy;
    #drama;
    #documentary;
  };

  public type UserProfile = {
    name : Text;
  };

  let videos = Map.empty<Nat, Video>();
  var nextId = 0;

  // Authorization and User Management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  func validateYouTubeUrl(url : Text) : Text {
    if (url.contains(#text "youtube.com") or url.contains(#text "youtu.be")) {
      return url;
    };
    Runtime.trap("Invalid YouTube URL");
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video Management (Admin Only)
  public shared ({ caller }) func createVideo(
    title : Text,
    description : ?Text,
    youtubeUrl : Text,
    genre : Genre,
    isOriginal : Bool,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create videos");
    };

    let validUrl = validateYouTubeUrl(youtubeUrl);

    let id = nextId;
    let video : Video = {
      id;
      title;
      description;
      youtubeUrl = validUrl;
      youtubeVideoId = validUrl;
      genre;
      isOriginal;
      createdAt = Time.now();
    };

    videos.add(id, video);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateVideo(
    id : Nat,
    title : Text,
    description : ?Text,
    youtubeUrl : Text,
    genre : Genre,
    isOriginal : Bool,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update videos");
    };

    let validUrl = validateYouTubeUrl(youtubeUrl);

    let existingVideo = switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };

    let updatedVideo : Video = {
      id = existingVideo.id;
      title;
      description;
      youtubeUrl = validUrl;
      youtubeVideoId = validUrl;
      genre;
      isOriginal;
      createdAt = existingVideo.createdAt;
    };

    videos.add(id, updatedVideo);
  };

  public shared ({ caller }) func deleteVideo(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete videos");
    };

    if (not videos.containsKey(id)) {
      Runtime.trap("Video not found");
    };
    videos.remove(id);
  };

  // Public read operations (accessible to all users including guests)
  public query ({ caller }) func listVideos() : async [Video] {
    videos.values().toArray();
  };

  public query ({ caller }) func getVideo(id : Nat) : async ?Video {
    videos.get(id);
  };

  public query ({ caller }) func getOriginalShows() : async [Video] {
    let allVideos = videos.values().toArray();
    allVideos.filter(func(v) { v.isOriginal });
  };

  public query ({ caller }) func getVideosByGenre(genre : Genre) : async [Video] {
    let allVideos = videos.values().toArray();
    allVideos.filter(func(v) { v.genre == genre });
  };

  // Admin Login Functionality
  public shared ({ caller }) func loginAsAdmin(code : Text) : async () {
    // Ensure caller is authenticated (not anonymous)
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated with Internet Identity to become admin");
    };

    // Verify the admin code
    if (not Text.equal(code, "Security777")) {
      Runtime.trap("Invalid code, please use the correct code to log in as admin");
    };

    // Assign admin role using the correct method
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
  };
};
