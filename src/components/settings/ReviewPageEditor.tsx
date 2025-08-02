"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save, Palette, Trash2, GripVertical, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

// Mock component representing an element on the review page
type ReviewComponent = {
    id: string;
    type: 'rating' | 'comment';
    label: string;
    required: boolean; // for comments
};

type ReviewPageEditorProps = {
    businessId: string;
}

export function ReviewPageEditor({ businessId }: ReviewPageEditorProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Mock state for settings and components
    const [pageTitle, setPageTitle] = useState("Leave a review for Your Business");
    const [components, setComponents] = useState<ReviewComponent[]>([
        { id: 'rating-1', type: 'rating', label: "How was your experience?", required: true },
        { id: 'comment-1', type: 'comment', label: "Tell us more", required: false },
    ]);

    const addComponent = (type: 'rating' | 'comment') => {
        const newId = `${type}-${Date.now()}`;
        const newComponent: ReviewComponent = {
            id: newId,
            type,
            label: type === 'rating' ? 'New Rating Question' : 'New Comment',
            required: type === 'comment' ? false : true,
        };
        setComponents(prev => [...prev, newComponent]);
    };
    
    const removeComponent = (id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id));
    };

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

    const handlePreview = () => {
        window.open(`/review/${businessId}`, '_blank');
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Review Page Editor</CardTitle>
                <CardDescription>Customize what customers see. Drag components in the preview to reorder (feature coming soon).</CardDescription>
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
                             <div className="space-y-4">
                                {components.map((component, index) => (
                                    <Card key={component.id}>
                                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                                            <CardTitle className="text-base m-0">
                                                {component.type === 'rating' ? `Star Rating #${index + 1}` : `Comment Box #${index + 1}`}
                                            </CardTitle>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removeComponent(component.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`${component.id}-label`}>{component.type === 'rating' ? 'Question' : 'Label'}</Label>
                                                <Input id={`${component.id}-label`} value={component.label} onChange={e => handleComponentChange(component.id, { label: e.target.value })}/>
                                            </div>
                                            {component.type === 'comment' && (
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`${component.id}-required`}
                                                        checked={component.required}
                                                        onCheckedChange={(checked) => handleComponentChange(component.id, { required: checked })}
                                                    />
                                                    <Label htmlFor={`${component.id}-required`}>Required</Label>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => addComponent('rating')}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Rating
                                </Button>
                                 <Button type="button" variant="outline" onClick={() => addComponent('comment')}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Comment
                                </Button>
                            </div>
                            
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button variant="outline" type="button" onClick={handlePreview}>
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
                                        {comp.type === 'rating' && (
                                            <div className="space-y-2 text-center">
                                                <Label className="text-base">{comp.label}</Label>
                                                <div className="flex justify-center">
                                                    <StarRating rating={3} readOnly />
                                                </div>
                                            </div>
                                        )}
                                        {comp.type === 'comment' && (
                                            <div className="space-y-2">
                                                <Label htmlFor={`preview-${comp.id}`}>
                                                    {comp.label}
                                                    {!comp.required && <span className="text-muted-foreground"> (optional)</span>}
                                                </Label>
                                                <Textarea
                                                    id={`preview-${comp.id}`}
                                                    placeholder="What could we do better?"
                                                    readOnly
                                                    required={comp.required}
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
