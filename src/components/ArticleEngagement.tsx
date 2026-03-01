import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ThumbsUp, MessageCircle, Share2, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface ArticleEngagementProps {
  articleId: string;
  articleTitle: string;
}

const ArticleEngagement = ({ articleId, articleTitle }: ArticleEngagementProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [articleId]);

  const fetchLikes = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("article_id", articleId);
    setLikes(count || 0);

    if (user) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();
      setLiked(!!data);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });
    setComments(data || []);
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error("Sign in to like articles");
      return;
    }
    if (liked) {
      await supabase.from("likes").delete().eq("article_id", articleId).eq("user_id", user.id);
      setLiked(false);
      setLikes((p) => p - 1);
    } else {
      await supabase.from("likes").insert({ article_id: articleId, user_id: user.id });
      setLiked(true);
      setLikes((p) => p + 1);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: articleTitle, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const submitComment = async () => {
    if (!user) {
      toast.error("Sign in to comment");
      return;
    }
    if (!newComment.trim()) return;
    setSubmitting(true);

    const displayName = user.user_metadata?.display_name || user.email || "Anonymous";
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      author_name: displayName,
      content: newComment.trim(),
    });

    if (error) {
      toast.error("Failed to post comment");
    } else {
      setNewComment("");
      fetchComments();
    }
    setSubmitting(false);
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-16">
      {/* Action bar */}
      <div className="flex items-center gap-1 border-y border-border py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          className={liked ? "text-primary" : "text-muted-foreground"}
        >
          <ThumbsUp className={`mr-1.5 h-4 w-4 ${liked ? "fill-primary" : ""}`} />
          {likes > 0 && <span className="text-xs">{likes}</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="mr-1.5 h-4 w-4" />
          {comments.length > 0 && <span className="text-xs">{comments.length}</span>}
        </Button>

        <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto" onClick={handleShare}>
          <Share2 className="mr-1.5 h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-6 space-y-6">
          <h3 className="font-heading text-lg font-semibold">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>

          {/* Comment input */}
          {user ? (
            <div className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none bg-muted/30 border-border"
                />
              </div>
              <Button
                size="icon"
                onClick={submitComment}
                disabled={submitting || !newComment.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              <a href="/auth" className="text-primary hover:underline">Sign in</a> to join the conversation.
            </p>
          )}

          {/* Comment list */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="group rounded-lg bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-foreground">{c.author_name}</span>
                    <span className="text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {user && user.id === c.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteComment(c.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleEngagement;
