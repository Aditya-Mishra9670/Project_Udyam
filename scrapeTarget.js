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

    // Find all form elements and associate with their labels
    $("input, select, textarea").each((index, element) => {
      const el = $(element);
      const fieldId = el.attr("id") || "";
      let labelText = "";

      // 1. Try to find label using 'for' attribute
      if (fieldId) {
        labelText = $(`label[for="${fieldId}"]`).text().trim();
      }

      // 2. If not found, try to find closest previous label in DOM
      if (!labelText) {
        const prevLabel = el.closest("td, th, div, span, p").prevAll("label").first();
        if (prevLabel.length) {
          labelText = prevLabel.text().trim();
        } else {
          // 3. Try to find parent label (for wrapped inputs)
          const parentLabel = el.parents("label").first();
          if (parentLabel.length) {
            labelText = parentLabel.text().trim();
          }
        }
      }

      // 4. If still not found, try to get the closest text node before the element (for table-based forms)
      if (!labelText) {
        const prevTd = el.closest("td, th").prev();
        if (prevTd.length) {
          labelText = prevTd.text().trim();
        }
      }

      // 5. Fallback: use placeholder or name
      if (!labelText) {
        labelText = el.attr("placeholder") || el.attr("name") || fieldId || "";
      }

      // Optionally, get table/section info for grouping
      let table = null;
      const tableEl = el.closest("table");
      if (tableEl.length) {
        table = tableEl.attr("id") || tableEl.attr("class") || null;
      }

      fieldsArray.push({
        elementType: el[0].tagName,
        fieldName: el.attr("name") || "",
        fieldType: el.attr("type") || (el[0].tagName === "textarea" ? "textarea" : el[0].tagName === "select" ? "select" : "text"),
        id: fieldId,
        placeholder: el.attr("placeholder") || "",
        label: labelText,
        table
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
