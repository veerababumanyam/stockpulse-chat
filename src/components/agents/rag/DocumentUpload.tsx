
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
}

export const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ];

    const validFiles = Array.from(files).filter(file => 
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Some files were skipped. Only PDF, TXT, DOCX, and MD files are supported.",
        variant: "destructive",
      });
    }

    // Simulated upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    onUpload(validFiles);
    toast({
      title: "Upload Complete",
      description: `${validFiles.length} documents have been uploaded successfully.`,
    });
    setUploadProgress(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Input
              type="file"
              multiple
              accept=".pdf,.txt,.docx,.md"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <span className="font-medium">Click to upload or drag and drop</span>
              <span className="text-sm text-muted-foreground">
                PDF, TXT, DOCX, MD (Max 100MB per file)
              </span>
            </Label>
          </div>
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
