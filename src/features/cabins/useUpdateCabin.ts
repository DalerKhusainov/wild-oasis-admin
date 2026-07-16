import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabin } from "../../services/apiCabins";
import type { CabinType } from "../../types/CabinType";
import { toast } from "react-hot-toast";

export function useUpdateCabin() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      updatedCabin,
      newImage,
    }: {
      id: number;
      updatedCabin: Partial<CabinType>;
      newImage?: File | null;
    }) => updateCabin(id, updatedCabin, newImage),

    onSuccess: (data) => {
      // Обновляем кэш после успешного обновления
      queryClient.invalidateQueries({ queryKey: ["cabins"] });

      // Или можно обновить конкретный домик в кэше
      queryClient.setQueryData(["cabin", data.id], data);

      // Показываем уведомление об успехе
      toast.success("Cabin's data was successfully updated");
    },

    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
    },
  });

  return { mutate, isPending };
}
