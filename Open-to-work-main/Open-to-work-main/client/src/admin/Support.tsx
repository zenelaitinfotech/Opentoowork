// src/pages/admin/Support.tsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:5000";

interface SupportQuery {
  _id: string;
  user: { full_name: string; email: string };
  subject: string;
  message: string;
  date: string;
  status: "pending" | "resolved";
}

const Support = () => {
  const { toast } = useToast();
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/support-queries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch queries");
      const data = await res.json();
      setQueries(data.queries || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/admin/support-queries/${id}/resolve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast({ title: "Query marked as resolved ✅" });
      fetchQueries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      const res = await fetch(`${API}/api/admin/support-queries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "Query deleted ✅" });
      fetchQueries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-4">User Support Queries</h2>

      <Card className="overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : queries.length === 0 ? (
          <p className="p-4">No support queries yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="font-medium">
  {q.user?.full_name || "Unknown User"}
</div>
<div className="text-sm text-muted-foreground">
  {q.user?.email || "No Email"}
</div>
                  </td>
                  <td className="px-4 py-2 font-semibold">{q.subject}</td>
                  <td className="px-4 py-2">{q.message}</td>
                  <td className="px-4 py-2">{new Date(q.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <Badge variant={q.status === "resolved" ? "secondary" : "destructive"}>
                      {q.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {q.status !== "resolved" && (
                      <Button size="sm" onClick={() => handleResolve(q._id)}>
                        Mark Resolved
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(q._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Support;