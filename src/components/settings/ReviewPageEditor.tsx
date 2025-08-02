"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

export function ReviewPageEditor() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Mock state for settings
    const [showCommentBox, setShowCommentBox] = useState(true);
    const [question, setQuestion] = useState("How was your experience?");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            console.log('Saving settings:', { showCommentBox, question });
            toast({
                title: "Settings Saved",
                description: "Your review page has been updated.",
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Review Page Editor</CardTitle>
                <CardDescription>Customize what customers see when they leave a review.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Settings Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="question">Rating Question</Label>
                            <Input 
                                id="question" 
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                             <Label htmlFor="show-comment-box">Show comment box for low ratings</Label>
                             <p className="text-sm text-muted-foreground">Allow users to provide detailed feedback.</p>
                           </div>
                            <Switch
                                id="show-comment-box"
                                checked={showCommentBox}
                                onCheckedChange={setShowCommentBox}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                                <Save className="mr-2 h-4 w-4" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </div>
                    </form>

                    {/* Live Preview */}
                    <div className="space-y-4 rounded-lg border border-dashed p-6">
                        <h3 className="text-lg font-semibold text-center text-muted-foreground">Live Preview</h3>
                         <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <Label className="text-base">{question}</Label>
                                <div className="flex justify-center">
                                <StarRating rating={3} readOnly />
                                </div>
                            </div>
                            {showCommentBox && (
                                <div className="space-y-2 animate-in fade-in-50 duration-500">
                                <Label htmlFor="comment-preview">Tell us more (optional)</Label>
                                <Textarea
                                    id="comment-preview"
                                    placeholder="What could we do better?"
                                    readOnly
                                />
                                </div>
                            )}
                            <Button className="w-full bg-accent hover:bg-accent/90" disabled>
                                Submit Review
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
