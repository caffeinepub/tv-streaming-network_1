import { useState, useEffect } from 'react';
import { useCreateVideo, useUpdateVideo } from '../../hooks/useVideos';
import { parseYouTubeUrl } from '../../utils/youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import type { Video, Genre } from '../../backend';

interface VideoFormProps {
  video?: Video | null;
  onClose: () => void;
}

export default function VideoForm({ video, onClose }: VideoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [genre, setGenre] = useState<Genre | ''>('');
  const [isOriginal, setIsOriginal] = useState(false);
  const [urlError, setUrlError] = useState('');

  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || '');
      setYoutubeUrl(video.youtubeUrl);
      setGenre(video.genre);
      setIsOriginal(video.isOriginal);
    }
  }, [video]);

  const validateUrl = (url: string): boolean => {
    const result = parseYouTubeUrl(url);
    if (!result.success) {
      setUrlError(result.error || 'Invalid URL');
      return false;
    }
    setUrlError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!genre) {
      toast.error('Please select a genre');
      return;
    }

    if (!validateUrl(youtubeUrl)) {
      return;
    }

    try {
      if (video) {
        await updateMutation.mutateAsync({
          id: video.id,
          title: title.trim(),
          description: description.trim() || null,
          youtubeUrl: youtubeUrl.trim(),
          genre: genre as Genre,
          isOriginal,
        });
        toast.success('Video updated successfully');
      } else {
        await createMutation.mutateAsync({
          title: title.trim(),
          description: description.trim() || null,
          youtubeUrl: youtubeUrl.trim(),
          genre: genre as Genre,
          isOriginal,
        });
        toast.success('Video added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save video');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{video ? 'Edit Video' : 'Add New Video'}</CardTitle>
            <CardDescription>
              {video ? 'Update video information' : 'Add a video to your collection'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter video description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL *</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              onBlur={() => youtubeUrl && validateUrl(youtubeUrl)}
              disabled={isLoading}
            />
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select value={genre} onValueChange={(value) => setGenre(value as Genre)} disabled={isLoading}>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="documentary">Documentary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isOriginal"
              checked={isOriginal}
              onCheckedChange={(checked) => setIsOriginal(checked === true)}
              disabled={isLoading}
            />
            <Label
              htmlFor="isOriginal"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Mark as Original Show
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {video ? 'Update Video' : 'Add Video'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
