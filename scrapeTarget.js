const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function fetchUdyamFormData() {
  const targetURL = "https://udyamregistration.gov.in/UdyamRegistration.aspx";

  try {
    // Fetch page HTML
    const { data: htmlContent } = await axios.get(targetURL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0)" }
    });

    const $ = cheerio.load(htmlContent);
    const fieldsArray = [];

    // Find all form elements in a more explicit loop
    $("input, select, textarea").each((index, element) => {
      const el = $(element);
      const fieldId = el.attr("id") || "";
      const labelText = $(`label[for="${fieldId}"]`).text().trim();

      fieldsArray.push({
        elementType: el[0].tagName,
        fieldName: el.attr("name") || "",
        fieldType: el.attr("type") || "text",
        id: fieldId,
        placeholder: el.attr("placeholder") || "",
        label: labelText
      });
    });

    // Save to file with a timestamped name
    const outputFile = "udyam_form_fields.json";
    fs.writeFile(outputFile, JSON.stringify(fieldsArray, null, 2), (err) => {
      if (err) throw err;
      console.log(`Data successfully written to ${outputFile}`);
    });

  } catch (err) {
    console.error("Error while fetching form data:", err.message);
  }
}

fetchUdyamFormData();
