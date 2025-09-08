import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, ChevronLeft, ChevronRight, Download, 
  ZoomIn, ZoomOut, RotateCw, Maximize2 
} from 'lucide-react';
import { FileInfo } from '../types/model';

interface ImageViewerProps {
  images: FileInfo[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageChange?: (index: number) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  open,
  onOpenChange,
  onImageChange
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];

  // 다이얼로그가 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [open, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0 && onImageChange) {
      onImageChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1 && onImageChange) {
      onImageChange(currentIndex + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    if (currentImage) {
      window.open(currentImage.fileUrl, '_blank');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onOpenChange(false);
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
          e.preventDefault();
          handleRotate();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, images.length, onImageChange, onOpenChange]);

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-gray-700">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {currentIndex + 1} / {images.length}
            </Badge>
            <span className="text-white text-sm font-medium">
              {currentImage.fileName}
            </span>
            {currentImage.isPrimary && (
              <Badge className="bg-blue-500 text-white text-xs">
                주요 이미지
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 컨트롤 버튼들 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 이미지 영역 */}
        <div 
          className="flex-1 flex items-center justify-center relative overflow-hidden"
          style={{ height: 'calc(95vh - 120px)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 이전/다음 버튼 */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleNext}
                disabled={currentIndex === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* 이미지 */}
          <img
            src={currentImage.fileUrl}
            alt={currentImage.fileName}
            className="max-w-none transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            draggable={false}
          />
        </div>

        {/* 하단 썸네일 */}
        {images.length > 1 && (
          <div className="p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
              {images.map((image, index) => (
                <button
                  key={image.fileId}
                  onClick={() => onImageChange?.(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                    index === currentIndex 
                      ? 'border-blue-500 ring-2 ring-blue-500/50' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image.fileUrl}
                    alt={image.fileName}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 키보드 단축키 안내 */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 opacity-75">
          <div>← → 이미지 변경 | + - 확대/축소 | R 회전 | 0 초기화 | ESC 닫기</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};