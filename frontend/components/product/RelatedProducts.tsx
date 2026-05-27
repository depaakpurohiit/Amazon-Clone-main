import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RelatedProducts() {
  return (
    <Card className="mt-16">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Related products</CardTitle>
        <Button variant="ghost" asChild>
          <Link href="/" className="text-primary hover:text-primary/80">
            View all
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Next step: fetch related items from `/api/products` by category/tag.
        </p>
      </CardContent>
    </Card>
  );
}

