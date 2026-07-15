import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteCabin } from "../../services/apiCabins";

export default function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteCabin(id),
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { mutate, isPending };
}
