import React, { useEffect, useState } from "react";
import { Button, Input, Spinner, Textarea } from "@heroui/react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import FileDropzone from "../../../components/dashboard-components/dropzone";
import { uploadFilesToServer } from "../../../lib/utils";
import {
  useGetSiteContentQuery,
  useUpdateSiteContentMutation,
} from "../../../redux/api/siteContent";
import { errorMessage, successMessage } from "../../../lib/toast.config";

const emptyButton = { btnText: "", btnLink: "" };
const emptyService = { icon: "", title: "", description: "" };

const resolveImageUrl = async (files) => {
  if (!files?.length) return "";
  if (typeof files[0] === "string") return files[0];
  if (files[0]?.file) {
    const uploaded = await uploadFilesToServer([files[0]]);
    return uploaded?.[0] || "";
  }
  return "";
};

const initialFormData = {
  aboutUsHeading: "",
  aboutUsDescription: "",
  aboutUsImage: "",
  buttons: [
    { btnText: "Our Mission", btnLink: "" },
    { btnText: "Our Teacher", btnLink: "" },
  ],
  missionLabel: "OUR MISSION",
  missionHeading: "",
  missionDescription: "",
  missionBtnText: "Explore our courses",
  missionBtnLink: "",
  missionImage: "",
  services: [
    { icon: "", title: "Recitation courses", description: "" },
    { icon: "", title: "Online classes", description: "" },
    { icon: "", title: "Gatherings & events", description: "" },
  ],
  founderLabel: "FOUNDER & DIRECTOR",
  founderName: "",
  founderBio: "",
  founderImage: "",
  founderTags: ["Ten Qira'at", "Hafs Ijazah", "Alimiyyah"],
};

const SiteContent = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [aboutImageFiles, setAboutImageFiles] = useState([]);
  const [missionImageFiles, setMissionImageFiles] = useState([]);
  const [founderImageFiles, setFounderImageFiles] = useState([]);
  const [serviceIconFiles, setServiceIconFiles] = useState([[], [], []]);

  const { data, isFetching, isError, error } = useGetSiteContentQuery();
  const [updateSiteContent, { isLoading: isSaving }] = useUpdateSiteContentMutation();

  useEffect(() => {
    if (!data?.data) return;

    const content = data.data;
    const buttons =
      Array.isArray(content.buttons) && content.buttons.length > 0
        ? content.buttons.map((btn) => ({
            btnText: btn.btnText || "",
            btnLink: btn.btnLink || "",
          }))
        : initialFormData.buttons;

    const services =
      Array.isArray(content.services) && content.services.length > 0
        ? content.services.map((service) => ({
            icon: service.icon || "",
            title: service.title || "",
            description: service.description || "",
          }))
        : initialFormData.services;

    const founderTags =
      Array.isArray(content.founderTags) && content.founderTags.length > 0
        ? content.founderTags.map((tag) => tag || "")
        : initialFormData.founderTags;

    setFormData({
      aboutUsHeading: content.aboutUsHeading || "",
      aboutUsDescription: content.aboutUsDescription || "",
      aboutUsImage: content.aboutUsImage || "",
      buttons,
      missionLabel: content.missionLabel || "",
      missionHeading: content.missionHeading || "",
      missionDescription: content.missionDescription || "",
      missionBtnText: content.missionBtnText || "",
      missionBtnLink: content.missionBtnLink || "",
      missionImage: content.missionImage || "",
      services,
      founderLabel: content.founderLabel || "",
      founderName: content.founderName || "",
      founderBio: content.founderBio || "",
      founderImage: content.founderImage || "",
      founderTags,
    });

    setAboutImageFiles(content.aboutUsImage ? [content.aboutUsImage] : []);
    setMissionImageFiles(content.missionImage ? [content.missionImage] : []);
    setFounderImageFiles(content.founderImage ? [content.founderImage] : []);
    setServiceIconFiles(services.map((service) => (service.icon ? [service.icon] : [])));
  }, [data]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateButton = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      buttons: current.buttons.map((btn, i) =>
        i === index ? { ...btn, [field]: value } : btn
      ),
    }));
  };

  const addButton = () => {
    setFormData((current) => ({
      ...current,
      buttons: [...current.buttons, { ...emptyButton }],
    }));
  };

  const removeButton = (index) => {
    setFormData((current) => ({
      ...current,
      buttons: current.buttons.filter((_, i) => i !== index),
    }));
  };

  const updateService = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      services: current.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const setServiceIconAt = (index, files) => {
    setServiceIconFiles((current) => {
      const next = [...current];
      next[index] = files;
      return next;
    });
  };

  const addService = () => {
    setFormData((current) => ({
      ...current,
      services: [...current.services, { ...emptyService }],
    }));
    setServiceIconFiles((current) => [...current, []]);
  };

  const removeService = (index) => {
    setFormData((current) => ({
      ...current,
      services: current.services.filter((_, i) => i !== index),
    }));
    setServiceIconFiles((current) => current.filter((_, i) => i !== index));
  };

  const updateTag = (index, value) => {
    setFormData((current) => ({
      ...current,
      founderTags: current.founderTags.map((tag, i) => (i === index ? value : tag)),
    }));
  };

  const addTag = () => {
    setFormData((current) => ({
      ...current,
      founderTags: [...current.founderTags, ""],
    }));
  };

  const removeTag = (index) => {
    setFormData((current) => ({
      ...current,
      founderTags: current.founderTags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.aboutUsHeading?.trim()) {
      errorMessage("Please enter the About Us heading");
      return;
    }

    try {
      const aboutUsImage = await resolveImageUrl(aboutImageFiles);
      const missionImage = await resolveImageUrl(missionImageFiles);
      const founderImage = await resolveImageUrl(founderImageFiles);

      const services = [];
      for (let i = 0; i < formData.services.length; i += 1) {
        const service = formData.services[i];
        const icon = await resolveImageUrl(serviceIconFiles[i] || []);
        if (icon || service.title.trim() || service.description.trim()) {
          services.push({
            icon,
            title: service.title.trim(),
            description: service.description.trim(),
          });
        }
      }

      const payload = {
        aboutUsHeading: formData.aboutUsHeading.trim(),
        aboutUsDescription: formData.aboutUsDescription.trim(),
        aboutUsImage,
        buttons: formData.buttons.filter((btn) => btn.btnText.trim() || btn.btnLink.trim()),
        missionLabel: formData.missionLabel.trim(),
        missionHeading: formData.missionHeading.trim(),
        missionDescription: formData.missionDescription.trim(),
        missionBtnText: formData.missionBtnText.trim(),
        missionBtnLink: formData.missionBtnLink.trim(),
        missionImage,
        services,
        founderLabel: formData.founderLabel.trim(),
        founderName: formData.founderName.trim(),
        founderBio: formData.founderBio.trim(),
        founderImage,
        founderTags: formData.founderTags.map((tag) => tag.trim()).filter(Boolean),
      };

      const res = await updateSiteContent(payload).unwrap();

      if (res.success) {
        successMessage(res.message || "Site content updated successfully");
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to update site content");
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
        Error: {error?.data?.message || error?.message || "Failed to load site content"}
      </div>
    );
  }

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <DashHeading
          title="Site Content"
          desc="Update About Us, Mission, Services, and Founder content for the website."
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-6"
      >
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Home Page About Us</h3>
          <div className="space-y-5">
            <Input
              label="About Us Heading"
              placeholder="ABOUT US"
              variant="bordered"
              labelPlacement="outside"
              value={formData.aboutUsHeading}
              onChange={(e) => updateField("aboutUsHeading", e.target.value)}
              isRequired
            />

            <Textarea
              label="About Us Description"
              placeholder="Enter the About Us description shown on the website"
              variant="bordered"
              labelPlacement="outside"
              minRows={5}
              value={formData.aboutUsDescription}
              onChange={(e) => updateField("aboutUsDescription", e.target.value)}
            />

            {/* <FileDropzone
              label="About Us Image"
              text="PNG, JPG or WEBP"
              files={aboutImageFiles}
              setFiles={setAboutImageFiles}
              fileType="image"
              isMultiple={false}
              maxSize={5}
              height="140px"
              showFilesNamesThere={false}
            /> */}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">About Us Buttons</h3>
              <p className="text-sm text-gray-500">
                Manage button labels and links for the About Us section.
              </p>
            </div>
            <Button
              type="button"
              variant="bordered"
              startContent={<FiPlus />}
              onPress={addButton}
            >
              Add Button
            </Button>
          </div>

          <div className="space-y-4">
            {formData.buttons.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-lg">
                No buttons yet. Click &quot;Add Button&quot; to create one.
              </p>
            )}

            {formData.buttons.map((btn, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end p-4 rounded-lg border border-gray-100 bg-gray-50/50"
              >
                <Input
                  label={`Button ${index + 1} Text`}
                  placeholder="Our Mission"
                  variant="bordered"
                  labelPlacement="outside"
                  value={btn.btnText}
                  onChange={(e) => updateButton(index, "btnText", e.target.value)}
                />
                <Input
                  label={`Button ${index + 1} Link`}
                  placeholder="/mission or https://..."
                  variant="bordered"
                  labelPlacement="outside"
                  value={btn.btnLink}
                  onChange={(e) => updateButton(index, "btnLink", e.target.value)}
                />
                <Button
                  type="button"
                  color="danger"
                  variant="flat"
                  isIconOnly
                  aria-label="Remove button"
                  onPress={() => removeButton(index)}
                  className="mb-0.5"
                >
                  <FiTrash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Our Mission */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us Page</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Mission Label"
                placeholder="OUR MISSION"
                variant="bordered"
                labelPlacement="outside"
                value={formData.missionLabel}
                onChange={(e) => updateField("missionLabel", e.target.value)}
              />
              <Input
                label="Mission Heading"
                placeholder="Empowering hearts through the Qur'an"
                variant="bordered"
                labelPlacement="outside"
                value={formData.missionHeading}
                onChange={(e) => updateField("missionHeading", e.target.value)}
              />
            </div>

            <Textarea
              label="Mission Description"
              placeholder="Enter the mission description"
              variant="bordered"
              labelPlacement="outside"
              minRows={5}
              value={formData.missionDescription}
              onChange={(e) => updateField("missionDescription", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Mission Button Text"
                placeholder="Explore our courses"
                variant="bordered"
                labelPlacement="outside"
                value={formData.missionBtnText}
                onChange={(e) => updateField("missionBtnText", e.target.value)}
              />
              <Input
                label="Mission Button Link"
                placeholder="/courses or https://..."
                variant="bordered"
                labelPlacement="outside"
                value={formData.missionBtnLink}
                onChange={(e) => updateField("missionBtnLink", e.target.value)}
              />
            </div>

            <FileDropzone
              label="Mission Image"
              text="PNG, JPG or WEBP"
              files={missionImageFiles}
              setFiles={setMissionImageFiles}
              fileType="image"
              isMultiple={false}
              maxSize={5}
              height="140px"
              showFilesNamesThere={false}
            />
          </div>
        </div>

        {/* Services */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Services</h3>
              <p className="text-sm text-gray-500">
                Manage service cards with icon, title, and description.
              </p>
            </div>
            <Button
              type="button"
              variant="bordered"
              startContent={<FiPlus />}
              onPress={addService}
            >
              Add Service
            </Button>
          </div>

          <div className="space-y-4">
            {formData.services.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-lg">
                No services yet. Click &quot;Add Service&quot; to create one.
              </p>
            )}

            {formData.services.map((service, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-medium text-gray-700">Service {index + 1}</h4>
                  <Button
                    type="button"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    aria-label="Remove service"
                    onPress={() => removeService(index)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Title"
                    placeholder="Recitation courses"
                    variant="bordered"
                    labelPlacement="outside"
                    value={service.title}
                    onChange={(e) => updateService(index, "title", e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Short description of this service"
                    variant="bordered"
                    labelPlacement="outside"
                    minRows={2}
                    value={service.description}
                    onChange={(e) => updateService(index, "description", e.target.value)}
                  />
                </div>

                  {/* <FileDropzone
                    label="Service Icon"
                    text="PNG, JPG or WEBP"
                    files={serviceIconFiles[index] || []}
                    setFiles={(files) => setServiceIconAt(index, files)}
                    fileType="image"
                    isMultiple={false}
                    maxSize={2}
                    height="100px"
                    showFilesNamesThere={false}
                  /> */}
              </div>
            ))}
          </div>
        </div>

        {/* Founder & Director */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Founder & Director</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Founder Label"
                placeholder="FOUNDER & DIRECTOR"
                variant="bordered"
                labelPlacement="outside"
                value={formData.founderLabel}
                onChange={(e) => updateField("founderLabel", e.target.value)}
              />
              <Input
                label="Founder Name"
                placeholder="Ustadhah Imaan"
                variant="bordered"
                labelPlacement="outside"
                value={formData.founderName}
                onChange={(e) => updateField("founderName", e.target.value)}
              />
            </div>

            <Textarea
              label="Founder Bio"
              placeholder="Enter the founder biography"
              variant="bordered"
              labelPlacement="outside"
              minRows={4}
              value={formData.founderBio}
              onChange={(e) => updateField("founderBio", e.target.value)}
            />

            <FileDropzone
              label="Founder Image"
              text="PNG, JPG or WEBP"
              files={founderImageFiles}
              setFiles={setFounderImageFiles}
              fileType="image"
              isMultiple={false}
              maxSize={5}
              height="140px"
              showFilesNamesThere={false}
            />

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Founder Tags</h4>
                  <p className="text-sm text-gray-500">
                    Skill or credential tags shown under the founder bio.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="bordered"
                  startContent={<FiPlus />}
                  onPress={addTag}
                >
                  Add Tag
                </Button>
              </div>

              <div className="space-y-3">
                {formData.founderTags.length === 0 && (
                  <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-lg">
                    No tags yet. Click &quot;Add Tag&quot; to create one.
                  </p>
                )}

                {formData.founderTags.map((tag, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end"
                  >
                    <Input
                      label={`Tag ${index + 1}`}
                      placeholder="Hafs Ijazah"
                      variant="bordered"
                      labelPlacement="outside"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      color="danger"
                      variant="flat"
                      isIconOnly
                      aria-label="Remove tag"
                      onPress={() => removeTag(index)}
                      className="mb-0.5"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            type="submit"
            color="success"
            startContent={<FiSave />}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteContent;
