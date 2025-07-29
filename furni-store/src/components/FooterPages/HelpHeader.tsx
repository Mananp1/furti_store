import { MessageCircleIcon } from "lucide-react";

export const HelpHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
          <MessageCircleIcon className="h-6 w-6" />
        </div>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Help & Contact Us
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Need assistance? Our friendly team is here to help. Send us a message
        and we'll get back to you as soon as possible.
      </p>
    </div>
  );
};
