import { useState, useCallback, useMemo } from "react";

export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseFormOptions<
  T extends object,
  S extends FormState = FormState
> {
  initialState: T;
  initialFormState?: Partial<S>;
  onSubmit: (data: T) => Promise<void> | void;
  validate?: (data: T) => string | null;
  onSuccess?: () => void;
  resetOnSuccess?: boolean;
  onFieldChange?: (
    field: keyof T,
    value: string,
    formData: T
  ) => Partial<S> | void;
}

export const useForm = <T extends object, S extends FormState = FormState>({
  initialState,
  initialFormState,
  onSubmit,
  validate,
  onSuccess,
  resetOnSuccess = false,
  onFieldChange,
}: UseFormOptions<T, S>) => {
  const [formData, setFormData] = useState<T>(initialState);
  const defaultFormState = useMemo<S>(
    () =>
      ({
        loading: false,
        error: null,
        success: false,
      } as S),
    []
  );
  const [state, setState] = useState<S>({
    ...defaultFormState,
    ...initialFormState,
  } as S);

  const handleChange = useCallback(
    (field: keyof T, value: string) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        if (onFieldChange) {
          const stateUpdate = onFieldChange(field, value, newData);
          if (stateUpdate) {
            setState((prev) => ({ ...prev, ...stateUpdate } as S));
          }
        }

        return newData;
      });

      setState(
        (prev) =>
          ({
            ...prev,
            error: null,
            success: false,
          } as S)
      );
    },
    [onFieldChange]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState(
        (prev) => ({ ...prev, loading: true, error: null, success: false } as S)
      );

      try {
        if (validate) {
          const validationError = validate(formData);
          if (validationError) {
            setState(
              (prev) =>
                ({
                  ...prev,
                  loading: false,
                  error: validationError,
                  success: false,
                } as S)
            );
            return;
          }
        }

        await onSubmit(formData);

        setState(
          (prev) =>
            ({ ...prev, loading: false, error: null, success: true } as S)
        );

        if (resetOnSuccess) {
          setFormData(initialState);
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        let errorMessage = "Une erreur est survenue";
        if (typeof error === "string") {
          errorMessage = error;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as { message: unknown }).message === "string"
        ) {
          errorMessage = (error as { message: string }).message;
        }
        setState(
          (prev) =>
            ({
              ...prev,
              loading: false,
              error: errorMessage,
              success: false,
            } as S)
        );
      }
    },
    [formData, validate, onSubmit, onSuccess, resetOnSuccess, initialState]
  );

  const reset = useCallback(() => {
    setFormData(initialState);
    const resetState = { ...defaultFormState, ...initialFormState } as S;
    setState(resetState);
  }, [initialState, initialFormState, defaultFormState]);

  return {
    formData,
    setFormData,
    state,
    handleChange,
    handleSubmit,
    reset,
  };
};
