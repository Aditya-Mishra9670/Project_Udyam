// Mapping technical field names to user-friendly labels
const fieldLabelMap = {
  "ctl00$ContentPlaceHolder1$txtadharno": "Aadhaar Number",
  "ctl00$ContentPlaceHolder1$txtownername": "Owner Name",
  "ctl00$ContentPlaceHolder1$txtPan": "PAN Number",
  "ctl00$ContentPlaceHolder1$txtPanName": "Name as per PAN",
  "ctl00$ContentPlaceHolder1$txtdob": "Date of Birth",
  "ctl00$ContentPlaceHolder1$ddlTypeofOrg": "Type of Organisation",
  "ctl00$ContentPlaceHolder1$rbpanyesno": "Do you have PAN?",
  "ctl00$ContentPlaceHolder1$rbdDOB": "DOB Type",
  "ctl00$ContentPlaceHolder1$chkDecarationP": "PAN Declaration",
  "ctl00$ContentPlaceHolder1$pin": "PIN Code",
  "ctl00$ContentPlaceHolder1$city": "City",
  "ctl00$ContentPlaceHolder1$state": "State",
  // Add more mappings as needed
};

export default function Home({ formSchema, formData, handleChange, handleSubmit, errors }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white/90 shadow-2xl p-8 rounded-2xl border border-blue-100 backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700 tracking-tight drop-shadow-sm">
          Udyam Registration
        </h2>
        <p className="text-center text-gray-500 mb-8 text-lg">Step 1 &amp; 2</p>

        <div className="grid gap-6 md:grid-cols-2">
          {formSchema.filter(field => field.type !== "hidden" && field.type !== "submit").map((field, idx) => (
            <div key={idx} className="flex flex-col gap-1 bg-blue-50/60 rounded-lg p-4 shadow-sm border border-blue-100">
              <label className="font-semibold text-blue-800 mb-1 text-sm tracking-wide">
                {fieldLabelMap[field.name] || field.label || field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.tag === "select" ? (
                <select
                  name={field.name}
                  className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 transition"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">-- Select --</option>
                  {Array.isArray(field.options) &&
                    field.options.map((opt, i) => (
                      <option key={i} value={opt.value || opt}>
                        {opt.label || opt}
                      </option>
                    ))}
                </select>
              ) : field.tag === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 transition min-h-[80px] resize-y"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={!!formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="accent-blue-600 h-5 w-5 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400"
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 transition"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              )}

              {errors && errors[field.name] && (
                <span className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-10 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide uppercase"
        >
          Submit
        </button>
      </form>
    </section>

  );
}