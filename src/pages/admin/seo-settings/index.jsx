import React, { useEffect, useState } from "react";
import { Button, Input, Spinner, Switch, Textarea, Tooltip } from "@heroui/react";
import { FiLock, FiSave } from "react-icons/fi";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  useGetSeoSettingsQuery,
  useUpdateSeoSettingsMutation,
} from "../../../redux/api/seoSettings";
import { errorMessage, successMessage } from "../../../lib/toast.config";

const initialFormData = {
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const mapSeoSettingsToForm = (settings) => ({
  metaTitle: settings?.metaTitle || "",
  metaDescription: settings?.metaDescription || "",
  metaKeywords: settings?.metaKeywords || "",
});

const getSaveErrorMessage = (err, fallback) =>
  err?.data?.message ||
  err?.error ||
  (err?.status ? `Request failed (${err.status})` : null) ||
  fallback;

const SeoSettings = () => {
  const [formData, setFormData] = useState(initialFormData);

  const { data, isFetching, isError, error } = useGetSeoSettingsQuery();
  const [updateSeoSettings, { isLoading: isSaving }] =
    useUpdateSeoSettingsMutation();

  useEffect(() => {
    if (!data?.data) return;

    setFormData(mapSeoSettingsToForm(data.data));
  }, [data]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      metaTitle: formData.metaTitle.trim(),
      metaDescription: formData.metaDescription.trim(),
      metaKeywords: formData.metaKeywords.trim(),
    };

    try {
      const res = await updateSeoSettings(payload).unwrap();

      if (res.success) {
        successMessage(res.message || "SEO settings updated successfully");
        if (res.data) {
          setFormData(mapSeoSettingsToForm(res.data));
        }
      }
    } catch (err) {
      console.error("SEO settings save failed:", err, "payload:", payload);
      errorMessage(getSaveErrorMessage(err, "Failed to update SEO settings"));
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error:{" "}
        {error?.data?.message || error?.message || "Failed to load SEO settings"}
      </div>
    );
  }

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <DashHeading
          title="SEO Settings"
          desc="Manage basic search engine metadata for the public website."
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic SEO</h3>
          <div className="space-y-5">
            <Input
              label="Meta Title"
              placeholder="Darul Quran Leicester"
              variant="bordered"
              labelPlacement="outside"
              value={formData.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
            />
            <Textarea
              label="Meta Description"
              placeholder="A short description of your website for search engines."
              variant="bordered"
              labelPlacement="outside"
              minRows={5}
              value={formData.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
            />
            <Input
              label="Meta Keywords"
              placeholder="quran, islam, online quran"
              variant="bordered"
              labelPlacement="outside"
              value={formData.metaKeywords}
              onChange={(e) => updateField("metaKeywords", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            type="submit"
            color="success"
            startContent={<FiSave />}
            isLoading={isSaving}
            isDisabled={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </form>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4 min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-800">Advanced SEO</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Unlock advanced SEO features including:</p>
              <ul className="list-none space-y-1 pl-0">
                <li>• Open Graph</li>
                <li>• Twitter Cards</li>
                <li>• Canonical URLs</li>
                <li>• Robots Meta</li>
                <li>• XML Sitemap</li>
                <li>• Structured Data (JSON-LD)</li>
              </ul>
              <p className="pt-1">These features will be available in a future update.</p>
            </div>
            <p className="text-xs text-gray-500">
              Advanced SEO is currently unavailable and will be released in a future update.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 opacity-60 cursor-not-allowed select-none">
            <Tooltip content="Advanced SEO will be available in a future update.">
              <div className="cursor-not-allowed pointer-events-auto">
                <Switch
                  isDisabled
                  isSelected={false}
                  aria-label="Advanced SEO"
                  color="success"
                  radius="sm"
                  classNames={{
                    base: "cursor-not-allowed opacity-100",
                    wrapper: "cursor-not-allowed",
                  }}
                />
              </div>
            </Tooltip>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-950">
              <FiLock className="h-3 w-3 shrink-0" aria-hidden />
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSettings;
