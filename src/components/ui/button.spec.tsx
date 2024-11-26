import { Button } from "@/components/ui/button";
import { render } from "@testing-library/react";

describe("Button", () => {

    it("should render Button", () => {
        render(<Button></Button>);
    });

    it('should render ', () => {
        render(<Button asChild={true}></Button>);
    });

});