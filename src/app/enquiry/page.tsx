import { Suspense } from "react";
import EnquiryForm from "@/app/components/EnquiryForm";

export default function EnquiryPage() {
  return (
    <Suspense fallback={null}>
      <EnquiryForm />
    </Suspense>
  );
}