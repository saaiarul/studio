
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Feedback } from '@/lib/data';

type WordCloudProps = {
    feedback: Feedback[];
}

// Simple stop words list
const stopWords = new Set(["a", "an", "the", "and", "or", "but", "is", "in", "it", "of", "for", "on", "with", "was", "to", "i", "you", "he", "she", "we", "they", "my", "your", "very", "so", "not", "just", "the", "was", "and", "it's", "it"]);

export function WordCloud({ feedback }: WordCloudProps) {
    const wordFrequencies = useMemo(() => {
        const words: { [key: string]: number } = {};
        feedback.forEach(f => {
            if (f.comment) {
                f.comment
                    .toLowerCase()
                    .replace(/[.,!?'"]/g, '') // remove punctuation
                    .split(/\s+/)
                    .forEach(word => {
                        if (word && !stopWords.has(word) && word.length > 2) {
                            words[word] = (words[word] || 0) + 1;
                        }
                    });
            }
        });

        const sortedWords = Object.entries(words)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30); // Top 30 words

        const maxFreq = sortedWords.length > 0 ? sortedWords[0][1] : 1;
        
        return sortedWords.map(([text, value]) => ({
            text,
            value,
            size: 12 + (value / maxFreq) * 48 // Font size from 12px to 60px
        }));

    }, [feedback]);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Common Keywords</CardTitle>
                <CardDescription>Most frequently mentioned words in your feedback.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                {wordFrequencies.length === 0 ? (
                     <p className="text-muted-foreground">Not enough comment data to generate a word cloud.</p>
                ): (
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        {wordFrequencies.map(word => (
                            <span
                                key={word.text}
                                className="text-foreground transition-all duration-300 hover:scale-110"
                                style={{
                                    fontSize: `${word.size}px`,
                                    fontWeight: word.size > 30 ? 600 : 400,
                                    lineHeight: 1,
                                    color: `hsl(var(--primary) / ${Math.max(0.4, word.size / 60)})`
                                }}
                            >
                                {word.text}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
