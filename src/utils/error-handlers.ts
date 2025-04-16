// Standardized error handling for wallet transactions
type ToastFunction = {
  toast: (props: {
    title: string;
    description: string;
    variant?: "default" | "destructive";
  }) => void;
};

type ErrorHandlerOptions = {
  defaultMessage: string;
  defaultTitle: string;
  toast?: ToastFunction["toast"];
};

export function handleTransactionError(
  error: unknown,
  options: ErrorHandlerOptions,
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>
): boolean {
  console.error(options.defaultTitle, error);
  
  // If no toast function provided, just log the error
  if (!options.toast) {
    console.error("Error toast function not provided to handleTransactionError");
    if (setIsSubmitting) setIsSubmitting(false);
    return false;
  }
  
  // Initialize error message and title with defaults
  let errorMessage = options.defaultMessage;
  const errorTitle = options.defaultTitle;
  
  // Check if error is an Error object
  if (error instanceof Error) {
    errorMessage = error.message;
    
    // Handle user rejection - don't show error toast for intentional cancellation
    if (errorMessage.toLowerCase().includes("user rejected") || 
        errorMessage.toLowerCase().includes("rejected by user") ||
        errorMessage.toLowerCase().includes("rejected the request") ||
        errorMessage.toLowerCase().includes("user denied") ||
        errorMessage.toLowerCase().includes("transaction cancelled")) {
      console.log("Transaction was rejected by the user");
      if (setIsSubmitting) setIsSubmitting(false);
      return true; // Handled, no need for further processing
    }
    
    // Specific handling for chain switching errors
    if (errorMessage.includes("network") || errorMessage.includes("chain")) {
      options.toast({
        title: "Network Switch Required",
        description: errorMessage,
        variant: "destructive",
      });
      if (setIsSubmitting) setIsSubmitting(false);
      return true; // Handled, no need for further processing
    }
    
    // Handle insufficient funds error
    if (errorMessage.includes("insufficient funds") || 
        errorMessage.includes("insufficient balance") || 
        errorMessage.includes("deposit more") ||
        errorMessage.toLowerCase().includes("eth")) {
      options.toast({
        title: "Insufficient Testnet ETH",
        description: "You need Base Sepolia testnet ETH to complete this transaction. Visit the Coinbase Base Sepolia Faucet to get free testnet ETH.",
        variant: "destructive",
      });
      if (setIsSubmitting) setIsSubmitting(false);
      return true; // Handled, no need for further processing
    }
  }
  
  // General error handling
  options.toast({
    title: errorTitle,
    description: `Error: ${errorMessage}`,
    variant: "destructive",
  });
  
  if (setIsSubmitting) setIsSubmitting(false);
  return false; // Not specifically handled
} 