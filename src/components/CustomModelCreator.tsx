import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Slider } from "./ui/slider";
import {
  Wand2,
  Lightbulb,
  User,
  Palette,
  Camera,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { CustomModelSettings } from "../App";

interface CustomModelCreatorProps {
  selectedCategory: string;
  onModelCreate: (settings: CustomModelSettings) => void;
}

const categoryNames: Record<string, string> = {
  fashion: "패션",
  electronics: "전자제품",
  beauty: "뷰티",
  home: "홈&리빙",
  food: "식품",
  lifestyle: "라이프스타일",
};

const promptTemplates: Record<string, string[]> = {
  fashion: [
    "젊은 여성이 {제품}을 착용하고 자연스럽게 포즈를 취하고 있는 모습",
    "세련된 남성이 {제품}을 착용하고 도시 배경에서 걷고 있는 모습",
    "20대 모델이 {제품}을 착용하고 스튜디오에서 전문적인 포즈를 취하고 있는 모습",
  ],
  electronics: [
    "전문가가 {제품}을 사용하여 업무를 보고 있는 모습",
    "젊은 사람이 {제품}을 활용하여 창작 활동을 하는 모습",
    "가족이 함께 {제품}을 사용하여 즐거운 시간을 보내는 모습",
  ],
  beauty: [
    "아름다운 여성이 {제품}을 사용하여 메이크업을 하고 있는 모습",
    "깔끔한 남성이 {제품}을 사용하여 그루밍을 하고 있는 모습",
    "자연스러운 모델이 {제품}을 사용한 후 만족스러운 표정을 짓고 있는 모습",
  ],
  home: [
    "따뜻한 가정에서 {제품}을 사용하여 일상을 보내는 모습",
    "깔끔한 인테리어 속에서 {제품}이 자연스럽게 배치된 모습",
    "가족이 {제품}과 함께 편안한 시간을 보내는 모습",
  ],
  food: [
    "요리사가 {제품}을 사용하여 맛있는 요리를 만드는 모습",
    "가족이 함께 {제품}을 즐기며 식사하는 모습",
    "젊은 사람이 {제품}을 맛보며 만족스러워하는 모습",
  ],
  lifestyle: [
    "활기찬 사람이 {제품}과 함께 액티브한 생활을 즐기는 모습",
    "여유로운 모델이 {제품}과 함께 힐링 타임을 보내는 모습",
    "트렌디한 사람이 {제품}을 활용하여 라이프스타일을 즐기는 모습",
  ],
};

export function CustomModelCreator({
  selectedCategory,
  onModelCreate,
}: CustomModelCreatorProps) {
  const [settings, setSettings] = useState<CustomModelSettings>(
    {
      prompt: "",
      age: "",
      gender: "",
      ethnicity: "",
      style: "",
      pose: "",
      lighting: "",
      background: "",
    },
  );
  const [currentStep, setCurrentStep] = useState<
    "basic" | "advanced" | "preview"
  >("basic");
  const [selectedTemplate, setSelectedTemplate] =
    useState<string>("");

  const handleSettingChange = (
    key: keyof CustomModelSettings,
    value: string,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    handleSettingChange("prompt", template);
  };

  const generateAutoPrompt = () => {
    const parts = [];

    if (settings.age) parts.push(settings.age);
    if (settings.ethnicity) parts.push(settings.ethnicity);
    if (settings.gender) parts.push(settings.gender);
    parts.push("모델이");

    parts.push("제품과 함께");

    if (settings.pose) parts.push(`${settings.pose} 포즈로`);
    if (settings.style)
      parts.push(`${settings.style} 스타일로`);

    parts.push("촬영된 모습");

    if (settings.lighting)
      parts.push(`${settings.lighting} 조명`);
    if (settings.background)
      parts.push(`${settings.background} 배경`);

    const autoPrompt = parts.join(" ");
    handleSettingChange("prompt", autoPrompt);
  };

  const isBasicComplete =
    settings.age &&
    settings.gender &&
    settings.ethnicity &&
    settings.style;
  const isAdvancedComplete =
    settings.pose && settings.lighting && settings.background;
  const isFormComplete =
    isBasicComplete && (settings.prompt || isAdvancedComplete);

  const handleCreate = () => {
    if (!isFormComplete) return;

    // If prompt is empty, generate it automatically
    if (!settings.prompt && isAdvancedComplete) {
      generateAutoPrompt();
    }

    onModelCreate(settings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2
            className="w-6 h-6"
            style={{ color: "var(--color-brand-primary)" }}
          />
          <h2
            style={{
              fontSize: "var(--font-size-title2)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-text-primary)",
            }}
          >
            커스텀 AI 모델 생성
          </h2>
        </div>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-regular)",
          }}
        >
          원하는 특성과 스타일을 설정하여{" "}
          {categoryNames[selectedCategory]} 제품에 최적화된
          나만의 AI 모델을 생성하세요
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          {["basic", "advanced", "preview"].map(
            (step, index) => {
              const isActive = currentStep === step;
              const isCompleted =
                (step === "basic" && isBasicComplete) ||
                (step === "advanced" && isAdvancedComplete) ||
                (step === "preview" && isFormComplete);

              return (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer`}
                    style={{
                      backgroundColor: isActive
                        ? "var(--color-brand-primary)"
                        : isCompleted
                          ? "var(--color-semantic-green)" + "20"
                          : "var(--color-background-tertiary)",
                      color: isActive
                        ? "var(--color-utility-white)"
                        : isCompleted
                          ? "var(--color-semantic-green)"
                          : "var(--color-text-tertiary)",
                    }}
                    onClick={() => setCurrentStep(step as any)}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{
                        backgroundColor:
                          isActive || isCompleted
                            ? "transparent"
                            : "var(--color-background-primary)",
                        color: isActive
                          ? "var(--color-utility-white)"
                          : isCompleted
                            ? "var(--color-semantic-green)"
                            : "var(--color-text-tertiary)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">
                      {step === "basic"
                        ? "기본 설정"
                        : step === "advanced"
                          ? "고급 설정"
                          : "미리보기"}
                    </span>
                  </div>
                  {index < 2 && (
                    <ChevronRight
                      className="w-4 h-4"
                      style={{
                        color: "var(--color-text-tertiary)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            },
          )}
        </div>
      </div>

      {/* Step Content */}
      <Card
        className="p-8"
        style={{
          backgroundColor: "var(--color-background-primary)",
          borderColor: "var(--color-border-primary)",
          borderRadius: "var(--radius-16)",
          boxShadow: "var(--shadow-medium)",
        }}
      >
        {currentStep === "basic" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <User
                className="w-5 h-5"
                style={{ color: "var(--color-brand-primary)" }}
              />
              <h3
                style={{
                  fontSize: "var(--font-size-title3)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                }}
              >
                모델 기본 특성
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  연령대
                </Label>
                <Select
                  value={settings.age}
                  onValueChange={(value) =>
                    handleSettingChange("age", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="연령대를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10대">10대</SelectItem>
                    <SelectItem value="20대 초반">
                      20대 초반
                    </SelectItem>
                    <SelectItem value="20대 후반">
                      20대 후반
                    </SelectItem>
                    <SelectItem value="30대 초반">
                      30대 초반
                    </SelectItem>
                    <SelectItem value="30대 후반">
                      30대 후반
                    </SelectItem>
                    <SelectItem value="40대">40대</SelectItem>
                    <SelectItem value="50대 이상">
                      50대 이상
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  성별
                </Label>
                <Select
                  value={settings.gender}
                  onValueChange={(value) =>
                    handleSettingChange("gender", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="여성">여성</SelectItem>
                    <SelectItem value="남성">남성</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  인종/민족
                </Label>
                <Select
                  value={settings.ethnicity}
                  onValueChange={(value) =>
                    handleSettingChange("ethnicity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="인종을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="아시아">
                      아시아
                    </SelectItem>
                    <SelectItem value="서양">서양</SelectItem>
                    <SelectItem value="아프리카">
                      아프리카
                    </SelectItem>
                    <SelectItem value="히스패닉">
                      히스패닉
                    </SelectItem>
                    <SelectItem value="혼혈">혼혈</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  스타일
                </Label>
                <Select
                  value={settings.style}
                  onValueChange={(value) =>
                    handleSettingChange("style", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="스타일을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="프로페셔널">
                      프로페셔널
                    </SelectItem>
                    <SelectItem value="캐주얼">
                      캐주얼
                    </SelectItem>
                    <SelectItem value="럭셔리">
                      럭셔리
                    </SelectItem>
                    <SelectItem value="비즈니스">
                      비즈니스
                    </SelectItem>
                    <SelectItem value="아티스틱">
                      아티스틱
                    </SelectItem>
                    <SelectItem value="내추럴">
                      내추럴
                    </SelectItem>
                    <SelectItem value="스포티">
                      스포티
                    </SelectItem>
                    <SelectItem value="빈티지">
                      빈티지
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                onClick={() => setCurrentStep("advanced")}
                disabled={!isBasicComplete}
                style={{
                  backgroundColor: "var(--color-brand-primary)",
                  color: "var(--color-utility-white)",
                  borderRadius: "var(--radius-8)",
                  fontSize: "var(--font-size-regular)",
                  fontWeight: "var(--font-weight-medium)",
                  opacity: !isBasicComplete ? 0.6 : 1,
                }}
              >
                다음 단계
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "advanced" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Camera
                className="w-5 h-5"
                style={{ color: "var(--color-brand-primary)" }}
              />
              <h3
                style={{
                  fontSize: "var(--font-size-title3)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                }}
              >
                촬영 및 스타일 설정
              </h3>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <Label
                style={{ color: "var(--color-text-primary)" }}
              >
                프롬프트 템플릿 (선택사항)
              </Label>
              <div className="grid gap-3">
                {promptTemplates[selectedCategory]?.map(
                  (template, index) => (
                    <Card
                      key={index}
                      className={`p-4 cursor-pointer transition-colors border-2 ${
                        selectedTemplate === template
                          ? "border-primary"
                          : "border-border"
                      }`}
                      style={{
                        borderColor:
                          selectedTemplate === template
                            ? "var(--color-brand-primary)"
                            : "var(--color-border-primary)",
                        backgroundColor:
                          selectedTemplate === template
                            ? "var(--color-brand-accent-tint)"
                            : "var(--color-background-primary)",
                      }}
                      onClick={() =>
                        handleTemplateSelect(template)
                      }
                    >
                      <p
                        className="text-sm"
                        style={{
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {template}
                      </p>
                    </Card>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  포즈
                </Label>
                <Select
                  value={settings.pose}
                  onValueChange={(value) =>
                    handleSettingChange("pose", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="포즈 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="자연스러운">
                      자연스러운
                    </SelectItem>
                    <SelectItem value="역동적인">
                      역동적인
                    </SelectItem>
                    <SelectItem value="정적인">
                      정적인
                    </SelectItem>
                    <SelectItem value="전문적인">
                      전문적인
                    </SelectItem>
                    <SelectItem value="캐주얼한">
                      캐주얼한
                    </SelectItem>
                    <SelectItem value="표현적인">
                      표현적인
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  조명
                </Label>
                <Select
                  value={settings.lighting}
                  onValueChange={(value) =>
                    handleSettingChange("lighting", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="조명 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="자연광">
                      자연광
                    </SelectItem>
                    <SelectItem value="스튜디오 조명">
                      스튜디오 조명
                    </SelectItem>
                    <SelectItem value="소프트 조명">
                      소프트 조명
                    </SelectItem>
                    <SelectItem value="드라마틱 조명">
                      드라마틱 조명
                    </SelectItem>
                    <SelectItem value="백라이트">
                      백라이트
                    </SelectItem>
                    <SelectItem value="골든 아워">
                      골든 아워
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  style={{ color: "var(--color-text-primary)" }}
                >
                  배경
                </Label>
                <Select
                  value={settings.background}
                  onValueChange={(value) =>
                    handleSettingChange("background", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="배경 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="화이트 스튜디오">
                      화이트 스튜디오
                    </SelectItem>
                    <SelectItem value="도시 풍경">
                      도시 풍경
                    </SelectItem>
                    <SelectItem value="자연 풍경">
                      자연 풍경
                    </SelectItem>
                    <SelectItem value="인테리어">
                      인테리어
                    </SelectItem>
                    <SelectItem value="미니멀">
                      미니멀
                    </SelectItem>
                    <SelectItem value="그라데이션">
                      그라데이션
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <Label
                style={{ color: "var(--color-text-primary)" }}
              >
                커스텀 프롬프트 (선택사항)
              </Label>
              <Textarea
                placeholder="원하는 특별한 요구사항이나 세부 사항을 입력하세요..."
                value={settings.prompt}
                onChange={(e) =>
                  handleSettingChange("prompt", e.target.value)
                }
                className="min-h-24"
                style={{
                  borderRadius: "var(--radius-8)",
                  borderColor: "var(--color-border-primary)",
                  backgroundColor:
                    "var(--color-input-background)",
                }}
              />
              <p
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                프롬프트를 입력하지 않으면 위 설정을 바탕으로
                자동 생성됩니다
              </p>
            </div>

            {/* Auto Generate Button */}
            {!settings.prompt && isAdvancedComplete && (
              <Button
                variant="outline"
                onClick={generateAutoPrompt}
                className="w-full"
                style={{
                  borderRadius: "var(--radius-8)",
                  borderColor: "var(--color-brand-primary)",
                  color: "var(--color-brand-primary)",
                }}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                설정 기반 프롬프트 자동 생성
              </Button>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("basic")}
                style={{
                  borderRadius: "var(--radius-8)",
                  borderColor: "var(--color-border-primary)",
                }}
              >
                이전
              </Button>
              <Button
                onClick={() => setCurrentStep("preview")}
                disabled={
                  !isAdvancedComplete && !settings.prompt
                }
                style={{
                  backgroundColor: "var(--color-brand-primary)",
                  color: "var(--color-utility-white)",
                  borderRadius: "var(--radius-8)",
                  fontSize: "var(--font-size-regular)",
                  fontWeight: "var(--font-weight-medium)",
                  opacity:
                    !isAdvancedComplete && !settings.prompt
                      ? 0.6
                      : 1,
                }}
              >
                미리보기
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "preview" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles
                className="w-5 h-5"
                style={{ color: "var(--color-brand-primary)" }}
              />
              <h3
                style={{
                  fontSize: "var(--font-size-title3)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                }}
              >
                모델 미리보기
              </h3>
            </div>

            {/* Model Summary */}
            <Card
              className="p-6"
              style={{
                backgroundColor:
                  "var(--color-background-secondary)",
                borderColor: "var(--color-border-primary)",
                borderRadius: "var(--radius-12)",
              }}
            >
              <h4
                className="mb-4"
                style={{
                  fontSize: "var(--font-size-regular)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                }}
              >
                생성될 모델 정보
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    연령대
                  </p>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor:
                        "var(--color-background-primary)",
                      color: "var(--color-text-primary)",
                      borderRadius: "var(--radius-4)",
                    }}
                  >
                    {settings.age}
                  </Badge>
                </div>
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    성별
                  </p>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor:
                        "var(--color-background-primary)",
                      color: "var(--color-text-primary)",
                      borderRadius: "var(--radius-4)",
                    }}
                  >
                    {settings.gender}
                  </Badge>
                </div>
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    인종
                  </p>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor:
                        "var(--color-background-primary)",
                      color: "var(--color-text-primary)",
                      borderRadius: "var(--radius-4)",
                    }}
                  >
                    {settings.ethnicity}
                  </Badge>
                </div>
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    스타일
                  </p>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor:
                        "var(--color-background-primary)",
                      color: "var(--color-text-primary)",
                      borderRadius: "var(--radius-4)",
                    }}
                  >
                    {settings.style}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p
                  className="text-xs"
                  style={{
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  생성 프롬프트
                </p>
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor:
                      "var(--color-background-primary)",
                    border: `1px solid var(--color-border-primary)`,
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-family-monospace)",
                  }}
                >
                  {settings.prompt ||
                    `${settings.age} ${settings.ethnicity} ${settings.gender} 모델이 제품과 함께 ${settings.pose} 포즈로 ${settings.style} 스타일로 촬영된 모습 ${settings.lighting} 조명 ${settings.background} 배경`}
                </div>
              </div>
            </Card>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("advanced")}
                style={{
                  borderRadius: "var(--radius-8)",
                  borderColor: "var(--color-border-primary)",
                }}
              >
                수정하기
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!isFormComplete}
                className="min-w-32"
                style={{
                  backgroundColor: "var(--color-brand-primary)",
                  color: "var(--color-utility-white)",
                  borderRadius: "var(--radius-8)",
                  fontSize: "var(--font-size-regular)",
                  fontWeight: "var(--font-weight-medium)",
                  opacity: !isFormComplete ? 0.6 : 1,
                }}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                모델 생성하기
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}