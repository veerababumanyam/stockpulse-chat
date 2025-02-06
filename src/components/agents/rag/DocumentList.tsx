
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";

interface DocumentListProps {
  documents: File[];
  onRemove: (index: number) => void;
}

export const DocumentList = ({ documents, onRemove }: DocumentListProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span>{doc.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onRemove(index);
                    toast({
                      title: "Document Removed",
                      description: "The document has been removed from the knowledge base.",
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No documents uploaded yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
