import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEventHandler, HTMLAttributes, RefCallback } from 'react';

type MaskElement = HTMLInputElement | HTMLTextAreaElement;

type UseInputMaskOptions = {
  /** Format, e.g. "dd/mm/yyyy" or "(###) ###-####". */
  format: string;
  /** Controlled formatted value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Add or override mask tokens. */
  tokens?: Record<string, RegExp>;
  /** Keyboard hint, e.g. "numeric" or "tel". */
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  onValueChange?: (value: string, unmaskedValue: string) => void;
};

type MaskPart = {
  char: string;
  pattern?: RegExp;
};

type MaskResult = {
  value: string;
  unmaskedValue: string;
  slotPositions: number[];
};

type MaskFieldProps = {
  ref: RefCallback<MaskElement>;
  value: string;
  onChange: ChangeEventHandler<MaskElement>;
  maxLength: number;
  placeholder: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
};

const EMPTY_TOKENS: Record<string, RegExp> = {};

const DEFAULT_TOKENS: Record<string, RegExp> = {
  d: /\d/,
  D: /\d/,
  m: /\d/,
  M: /\d/,
  y: /\d/,
  Y: /\d/,
  '#': /\d/,
  '9': /\d/,
  a: /[a-z]/i,
  A: /[a-z]/i,
  '*': /[a-z0-9]/i,
};

const matches = (pattern: RegExp, char: string): boolean => {
  pattern.lastIndex = 0;
  return pattern.test(char);
};

const createMaskParts = (
  format: string,
  customTokens: Record<string, RegExp>
): MaskPart[] => {
  const tokenPatterns = { ...DEFAULT_TOKENS, ...customTokens };
  const parts: MaskPart[] = [];

  for (let index = 0; index < format.length; index++) {
    const char = format[index];

    // Escape a token character to use it as a literal.
    if (char === '\\' && index + 1 < format.length) {
      parts.push({ char: format[++index] });
      continue;
    }

    parts.push({ char, pattern: tokenPatterns[char] });
  }

  return parts;
};

const applyMask = (input: string, parts: MaskPart[]): MaskResult => {
  const assigned: (string | undefined)[] = Array(parts.length);
  let inputIndex = 0;

  // Match entered characters to their corresponding mask slots.
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];

    if (!part.pattern) {
      if (input[inputIndex] === part.char) {
        inputIndex++;
      }

      continue;
    }

    while (inputIndex < input.length) {
      const char = input[inputIndex];

      if (matches(part.pattern, char)) {
        assigned[index] = char;
        inputIndex++;
        break;
      }

      // Preserve segment boundaries when an input separator is encountered.
      const isUpcomingLiteral = parts
        .slice(index + 1)
        .some((next) => !next.pattern && next.char === char);

      if (isUpcomingLiteral) {
        break;
      }

      inputIndex++;
    }
  }

  const output: string[] = [];
  const slotPositions: number[] = [];
  let currentGroup: number[] = [];

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];

    if (part.pattern) {
      currentGroup.push(index);

      const char = assigned[index];

      if (char !== undefined) {
        slotPositions.push(output.length);
        output.push(char);
      }

      continue;
    }

    // Process consecutive separators as one group.
    let end = index;

    while (end + 1 < parts.length && !parts[end + 1].pattern) {
      end++;
    }

    const groupIsComplete =
      currentGroup.length > 0 &&
      currentGroup.every((slot) => assigned[slot] !== undefined);

    const hasFilledSlotAfter = parts.some(
      (nextPart, nextIndex) =>
        nextIndex > end &&
        nextPart.pattern !== undefined &&
        assigned[nextIndex] !== undefined
    );

    const includeLiterals = currentGroup.length
      ? groupIsComplete || hasFilledSlotAfter
      : hasFilledSlotAfter;

    if (includeLiterals) {
      for (let literalIndex = index; literalIndex <= end; literalIndex++) {
        output.push(parts[literalIndex].char);
      }
    }

    currentGroup = [];
    index = end;
  }

  return {
    value: output.join(''),
    unmaskedValue: assigned
      .filter((char): char is string => char !== undefined)
      .join(''),
    slotPositions,
  };
};

/**
 * Applies a configurable input mask to text inputs and textareas.
 */
export const useInputMask = ({
  format,
  value,
  defaultValue = '',
  tokens = EMPTY_TOKENS,
  inputMode,
  placeholder,
  onValueChange,
}: UseInputMaskOptions) => {
  const isControlled = value !== undefined;

  const parts = useMemo(
    () => createMaskParts(format, tokens),
    [format, tokens]
  );

  const initialValue = applyMask(value ?? defaultValue, parts).value;
  const [internalValue, setInternalValue] = useState(initialValue);

  const displayValue = isControlled
    ? applyMask(value, parts).value
    : internalValue;

  const elementRef = useRef<MaskElement | null>(null);
  const pendingCaret = useRef<number | null>(null);

  const ref = useCallback<RefCallback<MaskElement>>((element) => {
    elementRef.current = element;
  }, []);

  useLayoutEffect(() => {
    const element = elementRef.current;
    const pendingSlotCount = pendingCaret.current;

    if (!element || pendingSlotCount === null) {
      return;
    }

    pendingCaret.current = null;

    const supportsSelection =
      element instanceof HTMLTextAreaElement ||
      (element instanceof HTMLInputElement &&
        ['text', 'search', 'tel', 'url', 'password'].includes(element.type));

    if (!supportsSelection) {
      return;
    }

    const result = applyMask(displayValue, parts);
    const count = Math.min(pendingSlotCount, result.slotPositions.length);

    const position =
      count === 0
        ? 0
        : count < result.slotPositions.length
        ? result.slotPositions[count]
        : result.value.length;

    element.setSelectionRange(position, position);
  }, [displayValue, parts]);

  const handleChange = useCallback<ChangeEventHandler<MaskElement>>(
    (event) => {
      const element = event.currentTarget;
      const cursor = element.selectionStart ?? element.value.length;

      const next = applyMask(element.value, parts);
      const prefix = applyMask(element.value.slice(0, cursor), parts);

      pendingCaret.current = prefix.slotPositions.length;

      if (!isControlled) {
        setInternalValue(next.value);
      }

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
    placeholder: placeholder ?? parts.map((part) => part.char).join(''),
    inputMode,
  };

  return {
    fieldProps,
    value: result.value,
    unmaskedValue: result.unmaskedValue,
  };
};
