// src/UploadHarness.tsx
import React, { useState } from 'react';
import { ProductUpload } from './components/workflow/ProductUpload';
import type { ProductImage } from './components/ImageGenerationWorkflow';
import type { SelectedModel } from './App';

const mockModel: SelectedModel = {
    id: 'demo',
    name: 'Demo Model',
    imageUrl: 'https://picsum.photos/80',
    metadata: {
        age: '20s',
        style: 'Modern',
        gender: 'female',
        ethnicity: 'asian',
    },
    prompt: '',
    seedValue: '0',
    category: 'test',
    isCustom: false,
};

export default function UploadHarness() {
    const [result, setResult] = useState<ProductImage[]>([]);
    return (
        <div className="p-6 space-y-6">
            <ProductUpload
                onUploadComplete={setResult}
                category="test"
                selectedModel={mockModel}
            />
            <div className="max-w-4xl mx-auto">
                <h3 className="font-semibold mt-6 mb-2">onUploadComplete 결과</h3>
                <pre className="text-sm bg-black/5 p-3 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
            </div>
        </div>
    );
}