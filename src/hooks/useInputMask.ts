import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEventHandler, HTMLAttributes, RefCallback } from 'react';

type MaskElement = HTMLInputElement | HTMLTextAreaElement;

export interface UseInputMaskOptions {
  format: string;
  value?: string;
  defaultValue?: string;
  tokens?: Record<string, RegExp>;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  onValueChange?: (value: string, unmaskedValue: string) => void;
}

type MaskPart = { char: string; pattern?: RegExp };
type MaskResult = { value: string; unmaskedValue: string; slotPositions: number[] };
type MaskFieldProps = {
  ref: RefCallback<MaskElement>;
  value: string;
  onChange: ChangeEventHandler<MaskElement>;
  maxLength: number;
  placeholder: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
};

const DEFAULT_TOKENS: Record<string, RegExp> = {
  d: /\d/, D: /\d/, m: /\d/, M: /\d/, y: /\d/, Y: /\d/,
  '#': /\d/, '9': /\d/, a: /[a-z]/i, A: /[a-z]/i, '*': /[a-z0-9]/i,
};

const matches = (pattern: RegExp, char: string) => {
  pattern.lastIndex = 0;
  return pattern.test(char);
};

const createMaskParts = (format: string, custom: Record<string, RegExp>): MaskPart[] => {
  const tokens = { ...DEFAULT_TOKENS, ...custom };
  const parts: MaskPart[] = [];
  for (let i = 0; i < format.length; i++) {
    const char = format[i];
    if (char === '\\' && i + 1 < format.length) {
      parts.push({ char: format[++i] });
      continue;
    }
    parts.push({ char, pattern: tokens[char] });
  }
  return parts;
};

const applyMask = (input: string, parts: MaskPart[]): MaskResult => {
  const assigned: (string | undefined)[] = Array(parts.length);
  let inputIndex = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part.pattern) {
      if (input[inputIndex] === part.char) inputIndex++;
      continue;
    }
    while (inputIndex < input.length) {
      const char = input[inputIndex];
      if (matches(part.pattern, char)) {
        assigned[i] = char;
        inputIndex++;
        break;
      }
      const isUpcoming = parts.slice(i + 1).some((n) => !n.pattern && n.char === char);
      if (isUpcoming) break;
      inputIndex++;
    }
  }

  const output: string[] = [];
  const slotPositions: number[] = [];
  let currentGroup: number[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.pattern) {
      currentGroup.push(i);
      const char = assigned[i];
      if (char !== undefined) {
        slotPositions.push(output.length);
        output.push(char);
      }
      continue;
    }
    let end = i;
    while (end + 1 < parts.length && !parts[end + 1].pattern) end++;
    const groupComplete = currentGroup.length > 0 && currentGroup.every((s) => assigned[s] !== undefined);
    const hasFilledAfter = parts.some(
      (np, ni) => ni > end && np.pattern !== undefined && assigned[ni] !== undefined
    );
    const include = currentGroup.length ? groupComplete || hasFilledAfter : hasFilledAfter;
    if (include) {
      for (let li = i; li <= end; li++) output.push(parts[li].char);
    }
    currentGroup = [];
    i = end;
  }

  return {
    value: output.join(''),
    unmaskedValue: assigned.filter((c): c is string => c !== undefined).join(''),
    slotPositions,
  };
};

export const useInputMask = ({
  format,
  value,
  defaultValue = '',
  tokens = {},
  inputMode,
  placeholder,
  onValueChange,
}: UseInputMaskOptions) => {
  const isControlled = value !== undefined;
  const parts = useMemo(() => createMaskParts(format, tokens), [format, tokens]);
  const initial = applyMask(value ?? defaultValue, parts).value;
  const [internal, setInternal] = useState(initial);

  const displayValue = isControlled ? applyMask(value, parts).value : internal;
  const elementRef = useRef<MaskElement | null>(null);
  const pendingCaret = useRef<number | null>(null);

  const ref = useCallback<RefCallback<MaskElement>>((el) => {
    elementRef.current = el;
  }, []);

  useLayoutEffect(() => {
    const el = elementRef.current;
    const pending = pendingCaret.current;
    if (!el || pending === null) return;
    pendingCaret.current = null;
    const supportsSel =
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLInputElement && ['text', 'search', 'tel', 'url', 'password'].includes(el.type));
    if (!supportsSel) return;
    const result = applyMask(displayValue, parts);
    const count = Math.min(pending, result.slotPositions.length);
    const position = count === 0 ? 0 : count < result.slotPositions.length ? result.slotPositions[count] : result.value.length;
    el.setSelectionRange(position, position);
  }, [displayValue, parts]);

  const handleChange = useCallback<ChangeEventHandler<MaskElement>>(
    (event) => {
      const el = event.currentTarget;
      const cursor = el.selectionStart ?? el.value.length;
      const next = applyMask(el.value, parts);
      const prefix = applyMask(el.value.slice(0, cursor), parts);
      pendingCaret.current = prefix.slotPositions.length;
      if (!isControlled) setInternal(next.value);
      onValueChange?.(next.value, next.unmaskedValue);
    },
    [isControlled, onValueChange, parts]
  );

  const result = applyMask(displayValue, parts);

  const fieldProps: MaskFieldProps = {
    ref,
    value: result.value,
    onChange: handleChange,
    maxLength: parts.length,
    placeholder: placeholder ?? parts.map((p) => p.char).join(''),
    inputMode,
  };

  return { fieldProps, value: result.value, unmaskedValue: result.unmaskedValue };
};
