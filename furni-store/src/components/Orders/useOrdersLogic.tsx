import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { getPaymentHistory } from "@/lib/payment";

export const useOrdersLogic = () => {
  const { data: session } = useSession();

  const {
    data: paymentHistory,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: () => getPaymentHistory(1, 50),
    enabled: !!session,
  });

  return {
    paymentHistory,
    isLoading,
    error,
    refetch,
  };
};
