import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type TablePaginationProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

export default function TablePagination({
  page,
  setPage,
  totalPages,
}: TablePaginationProps) {
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (page <= 2) {
      return [1, 2, 3];
    } else if (page >= totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [page - 1, page, page + 1];
  };

  const pageNumbers = getPageNumbers();


  return (
    <Pagination dir="ltr">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={() => setPage(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
            size="sm"
            variant="ghost"
          >
            <ArrowLeft></ArrowLeft>
            Previous
          </Button>
        </PaginationItem>

        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <Button
              onClick={() => setPage(p)}
              className={p === page ? "bg-primary" : ""}
              variant={p === page ? "default" : "outline"}
              size="sm"
            >
              {p}
            </Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            onClick={() => setPage(page + 1)}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
            variant="ghost"
            size="sm"
          >
            Next
            <ArrowRight></ArrowRight>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
