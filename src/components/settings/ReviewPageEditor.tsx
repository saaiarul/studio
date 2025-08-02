"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save, Palette, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

// Mock component representing an element on the review page
type ReviewComponent = {
    id: string;
    type: 'rating' | 'comment';
    label: string;
    enabled: boolean;
};

export function ReviewPageEditor() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Mock state for settings and components
    const [pageTitle, setPageTitle] = useState("Leave a review for Your Business");
    const [components, setComponents] = useState<ReviewComponent[]>([
        { id: '1', type: 'rating', label: "How was your experience?", enabled: true },
        { id: '2', type: 'comment', label: "Tell us more (optional)", enabled: true },
    ]);
    
    const ratingComponent = components.find(c => c.type === 'rating');
    const commentComponent = components.find(c => c.type === 'comment');

    const handleComponentChange = (id: string, newValues: Partial<ReviewComponent>) => {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, ...newValues } : c));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            console.log('Saving settings:', { pageTitle, components });
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
                <CardDescription>Customize what customers see. Click and drag components in the preview to reorder them.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Settings Panel */}
                        <div className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="pageTitle">Page Title</Label>
                                <Input 
                                    id="pageTitle" 
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                />
                            </div>

                            {/* Component Settings */}
                            {ratingComponent && (
                                <Card>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base">Star Rating</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="rating-label">Question</Label>
                                            <Input id="rating-label" value={ratingComponent.label} onChange={e => handleComponentChange(ratingComponent.id, { label: e.target.value })}/>
                                         </div>
                                    </CardContent>
                                </Card>
                            )}

                             {commentComponent && (
                                <Card>
                                    <CardHeader className="p-4 flex flex-row items-center justify-between">
                                        <CardTitle className="text-base m-0">Comment Box</CardTitle>
                                        <Switch
                                            id="show-comment-box"
                                            checked={commentComponent.enabled}
                                            onCheckedChange={(checked) => handleComponentChange(commentComponent.id, { enabled: checked })}
                                        />
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="comment-label">Label</Label>
                                            <Input id="comment-label" value={commentComponent.label} onChange={e => handleComponentChange(commentComponent.id, { label: e.target.value })}/>
                                         </div>
                                    </CardContent>
                                </Card>
                            )}
                            
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button variant="outline">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="space-y-4 rounded-lg border border-dashed p-6 bg-background/50">
                            <h3 className="text-lg font-semibold text-center text-muted-foreground mb-6">Live Preview</h3>
                            <div className="w-full max-w-sm mx-auto space-y-8">
                                <CardTitle className="text-xl text-center">{pageTitle}</CardTitle>
                                {components.map(comp => (
                                    <div key={comp.id} className="relative group animate-in fade-in-50 duration-500">
                                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 cursor-grab">
                                            <GripVertical className="h-5 w-5" />
                                        </div>
                                        {comp.type === 'rating' && comp.enabled && (
                                            <div className="space-y-2 text-center">
                                                <Label className="text-base">{comp.label}</Label>
                                                <div className="flex justify-center">
                                                    <StarRating rating={3} readOnly />
                                                </div>
                                            </div>
                                        )}
                                        {comp.type === 'comment' && comp.enabled && (
                                            <div className="space-y-2">
                                                <Label htmlFor="comment-preview">{comp.label}</Label>
                                                <Textarea
                                                    id="comment-preview"
                                                    placeholder="What could we do better?"
                                                    readOnly
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                <Button className="w-full bg-accent hover:bg-accent/90" disabled>
                                    Submit Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
