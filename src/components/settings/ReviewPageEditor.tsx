
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save, Palette, UploadCloud, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBusinessById, updateBusiness, ReviewPageTheme } from "@/lib/data";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type ReviewPageEditorProps = {
    businessId: string;
}

export function ReviewPageEditor({ businessId }: ReviewPageEditorProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [isRatingOptional, setIsRatingOptional] = useState(false);
    const [isCommentRequired, setIsCommentRequired] = useState(false);
    const [theme, setTheme] = useState<ReviewPageTheme>({
        primaryColor: '#4A90E2',
        backgroundColor: '#F5F8FA',
        textColor: '#333333',
        buttonColor: '#50E3C2',
        buttonTextColor: '#FFFFFF',
    });

    useEffect(() => {
        const fetchBusinessData = async () => {
            setIsFetching(true);
            const business = await getBusinessById(businessId);
            if (business) {
                setWelcomeMessage(business.welcomeMessage || `Leave a review for ${business.name}`);
                setLogoUrl(business.logoUrl);
                setIsRatingOptional(business.isRatingOptional || false);
                setIsCommentRequired(business.isCommentRequired || false);
                if(business.theme) setTheme(business.theme);
            }
            setIsFetching(false);
        };
        fetchBusinessData();
    }, [businessId]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoUrl(URL.createObjectURL(file));
        }
    };
    
    const handleThemeChange = (field: keyof ReviewPageTheme, value: string) => {
        setTheme(prev => ({...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        let uploadedLogoUrl = logoUrl;
        if (logoFile) {
            // In a real app, you would upload the file to a storage service (e.g., Firebase Storage)
            // and get the public URL. Here, we'll just simulate it.
            // For this demo, we'll just use the local blob URL which will work for the preview,
            // but won't persist. A real implementation is needed for permanent storage.
            uploadedLogoUrl = URL.createObjectURL(logoFile);
        }

        try {
            await updateBusiness(businessId, {
                welcomeMessage,
                logoUrl: uploadedLogoUrl,
                theme,
                isRatingOptional,
                isCommentRequired
            });
            toast({
                title: "Settings Saved",
                description: "Your review page has been updated.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error Saving",
                description: "Could not save your settings.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = () => {
        window.open(`/review/${businessId}`, '_blank');
    }

    if (isFetching) {
        return <p>Loading settings...</p>
    }

    return (
        <TooltipProvider>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Review Page Customization</CardTitle>
                <CardDescription>Personalize the review page with your own branding, colors, and form options.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Settings Panel */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <div className="flex items-center gap-4">
                                     <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        {logoUrl ? (
                                            <Image src={logoUrl} alt="logo" width={80} height={80} className="object-cover w-20 h-20" data-ai-hint="logo"/>
                                        ) : (
                                            <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <Button asChild variant="outline">
                                        <label htmlFor="logo-upload" className="cursor-pointer">
                                            {logoUrl ? 'Change Logo' : 'Upload Logo'}
                                            <Input id="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*" />
                                        </label>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                                <Textarea 
                                    id="welcomeMessage" 
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                    placeholder="Welcome! Please leave us a review."
                                />
                            </div>

                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base m-0 flex items-center gap-2">
                                        <Palette className="w-5 h-5" />
                                        Page Colors
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
                                    {Object.entries(theme).map(([key, value]) => (
                                         <div key={key} className="space-y-2">
                                            <Label htmlFor={`theme-${key}`} className="capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    id={`theme-${key}`}
                                                    type="color" 
                                                    value={value} 
                                                    onChange={e => handleThemeChange(key as keyof ReviewPageTheme, e.target.value)}
                                                    className="w-12 h-10 p-1"
                                                />
                                                <Input 
                                                     value={value} 
                                                     onChange={e => handleThemeChange(key as keyof ReviewPageTheme, e.target.value)}
                                                     className="h-10"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base m-0 flex items-center gap-2">
                                        Form Options
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="ratingOptional">Make Star Rating Optional</Label>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>If enabled, users can submit the form without selecting a rating.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Switch
                                            id="ratingOptional"
                                            checked={isRatingOptional}
                                            onCheckedChange={setIsRatingOptional}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                        <Label htmlFor="commentRequired">Make Comment Required</Label>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>If enabled, users must write a comment to submit the form.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Switch
                                            id="commentRequired"
                                            checked={isCommentRequired}
                                            onCheckedChange={setIsCommentRequired}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            
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
                        <div 
                            className="space-y-4 rounded-lg border border-dashed p-6"
                            style={{ 
                                backgroundColor: theme.backgroundColor,
                                color: theme.textColor
                            }}
                        >
                            <h3 className="text-lg font-semibold text-center opacity-70 mb-6">Live Preview</h3>
                            <div className="w-full max-w-sm mx-auto space-y-8">
                                {logoUrl && (
                                     <div className="flex justify-center">
                                        <Image src={logoUrl} alt="preview logo" width={80} height={80} className="rounded-full object-cover w-20 h-20" data-ai-hint="logo"/>
                                    </div>
                                )}
                                <CardTitle className="text-xl text-center" style={{ color: theme.textColor }}>{welcomeMessage}</CardTitle>
                                
                                <div className="text-center">
                                    <Label className="text-base" style={{ opacity: 0.9 }}>How was your experience? {isRatingOptional && "(Optional)"}</Label>
                                    <div className="flex justify-center mt-2">
                                        <p style={{color: theme.primaryColor}}>★★★★★</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <Label className="text-base" style={{ opacity: 0.9 }}>Tell us more {isCommentRequired ? "(Required)" : "(Optional)"}</Label>
                                    <div className="mt-2 w-full h-20 rounded-md bg-white/20 p-2 border border-white/30"></div>
                                </div>
                                
                                <Button className="w-full" style={{backgroundColor: theme.buttonColor, color: theme.buttonTextColor}} disabled>
                                    Submit Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
        </TooltipProvider>
    );
}
