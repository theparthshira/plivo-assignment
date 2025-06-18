import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { Input } from "../../components/ui/input";
import { useAppDispatch, useAppSelector } from "../../lib/reduxHook";
import {
  addIncidentComment,
  getIncidentComments,
  getIncidentDetail,
} from "../../redux/incident";
import { formatDate } from "../../utils/date";
import { IncidentStatusTag } from "../../lib/tags";

const Incident = () => {
  const dispatch = useAppDispatch();

  const { incidentDetail, incidentComments } = useAppSelector(
    (state) => state.incident
  );

  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const service_id = queryParams.get("service") || "0";
    const org_id = queryParams.get("org") || "0";
    const incident_id = queryParams.get("incident") || "0";

    dispatch(getIncidentDetail(incident_id));
    dispatch(getIncidentComments(incident_id));
  }, []);

  const handleAddComment = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const incident_id = queryParams.get("incident") || "0";
    try {
      await dispatch(
        addIncidentComment({
          IncidentID: parseInt(incident_id),
          Comment: newComment,
          CommentBy: userName,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      dispatch(getIncidentComments(incident_id));
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            S#{incidentDetail?.service_id} {incidentDetail?.description}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Status:{"   "}
            <IncidentStatusTag status={incidentDetail?.incident_status || ""} />
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
      </div>

      {/* Add New Comment */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Add New Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              placeholder="Enter your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || !userName.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Spinner icon
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {incidentComments && incidentComments?.length > 0 ? (
          incidentComments.map((comment) => (
            <Card key={comment.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <p className="text-gray-900 leading-relaxed">
                    {comment.comment}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                    <span>by {comment.comment_by}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No comments yet
              </h3>
              <p className="text-gray-500">
                Be the first to add a comment above.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Incident;
