import { fireEvent,act, render, screen } from "../../test-utils";
import TemplateDetail from "./index";

describe("TemplateDetail", () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: function () {},
          removeListener: function () {},
        };
      };
  });
  beforeEach(() => {
    render(<TemplateDetail />);
  });

  test("Renders correctly", () => {
    render(<TemplateDetail />);
  });
  test("student certificate img", () => {
    const certificateImage = screen.getByRole("img", { name: /CourseComplitionBlankTemplate/i });
    expect(certificateImage).toBeInTheDocument();
  });

  test("is downloadcsvbutton present?", () => {
    const downloadCsvbutton = screen.getByRole("button", {
      name: /Download sample CSV/i,
    })
      expect(downloadCsvbutton).toBeInTheDocument()
    });

    test("is downloadcsvbutton present?", () => {
        const bulkCertificates = screen.getByRole("button", {
          name: /Generate Batch Certificate/i,
        })
        expect(bulkCertificates).toBeInTheDocument();
      });
    
      test("is table of templateDetail?", () => {
        const templatedetailTable = screen.getByRole("table")
        expect(templatedetailTable).toBeInTheDocument();
      });

    //   const navbarComponent = screen.getByTestId('custom-element')
    //     expect(navbarComponent).toBeInTheDocument()
    

})