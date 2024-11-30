/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { ConvexError } from "convex/values";

type RequestType = { workspaceId: Id<"workspaces">; joinCode: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error | string) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useJoin = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.join);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const response = await mutation(values);

        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof ConvexError
            ? (error.data as { message: string }).message
            : ("Unexpected error occured");

        setStatus("error");
        options?.onError?.(errorMessage);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus(null);
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSettled, isSuccess, isError };
};
