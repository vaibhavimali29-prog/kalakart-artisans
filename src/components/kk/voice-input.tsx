import { Mic, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const localeMap: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getRecognition(lang: Lang): SpeechRecognitionLike | null {
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = localeMap[lang];
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}

/** Speaks a label out loud so artisans can hear what a field is for. */
export function SpeakLabel({ text }: { text: string }) {
  const { lang } = useI18n();
  return (
    <button
      type="button"
      aria-label={`Listen: ${text}`}
      onClick={() => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = localeMap[lang];
        window.speechSynthesis.speak(utter);
      }}
      className="tap grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-primary"
    >
      <Volume2 className="size-3.5" />
    </button>
  );
}

/** Microphone button that fills a text field by voice, with graceful fallback. */
export function VoiceFill({ onText, className }: { onText: (text: string) => void; className?: string }) {
  const { lang } = useI18n();
  const [listening, setListening] = useState(false);

  return (
    <button
      type="button"
      aria-label="Fill this field using your voice"
      onClick={() => {
        const rec = getRecognition(lang);
        if (!rec) {
          toast("Voice typing is not supported on this device", {
            description: "Please type your answer instead.",
          });
          return;
        }
        setListening(true);
        rec.onresult = (event) => onText(event.results[0][0].transcript);
        rec.onerror = () => toast("Could not hear you. Please try again.");
        rec.onend = () => setListening(false);
        rec.start();
      }}
      className={cn(
        "tap grid size-10 shrink-0 place-items-center rounded-2xl transition-colors",
        listening ? "bg-gradient-warm text-primary-foreground pulse-mic" : "bg-secondary text-primary",
        className,
      )}
    >
      <Mic className="size-4.5" />
    </button>
  );
}
