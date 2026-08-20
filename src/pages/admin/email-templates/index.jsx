import { useMemo, useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Spinner,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import {
  useCreateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useGetEmailTemplatesQuery,
  usePreviewEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  SYSTEM_TEMPLATE_VARIABLES,
  slugifyFormLabel,
  buildPreviewMapFromVariables,
} from "../../../redux/api/emailTemplates";
import { successMessage, errorMessage } from "../../../lib/toast.config";
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiCopy, FiList } from "react-icons/fi";

const emptyForm = {
  name: "",
  subject: "",
  body: "",
  variables: [],
};

const emptyVariable = { label: "", slug: "", sampleValue: "" };

const EmailTemplates = () => {
  const { data, isLoading } = useGetEmailTemplatesQuery();
  const [createTemplate, { isLoading: isCreating }] = useCreateEmailTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteEmailTemplateMutation();
  const [previewTemplate, { isLoading: isPreviewing }] = usePreviewEmailTemplateMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const {
    isOpen: isVariablesOpen,
    onOpen: onVariablesOpen,
    onClose: onVariablesClose,
  } = useDisclosure();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [previewData, setPreviewData] = useState({ subject: "", body: "", variablesUsed: {} });
  const [viewVariables, setViewVariables] = useState([]);

  const templates = data?.templates || [];

  const variableRows = useMemo(
    () =>
      (formData.variables || []).map((item, index) => ({
        ...item,
        slug: item.slug || slugifyFormLabel(item.label),
        key: `${item.label}-${index}`,
      })),
    [formData.variables],
  );

  const handleOpen = (template = null) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        name: template.name || "",
        subject: template.subject || "",
        body: template.body || "",
        variables: (template.variables || []).map((v) => ({
          label: v.label || "",
          slug: v.slug || slugifyFormLabel(v.label),
          sampleValue: v.sampleValue || "",
        })),
      });
    } else {
      setSelectedTemplate(null);
      setFormData(emptyForm);
    }
    onOpen();
  };

  const addVariableRow = () => {
    setFormData((prev) => ({
      ...prev,
      variables: [...(prev.variables || []), { ...emptyVariable }],
    }));
  };

  const updateVariableRow = (index, field, value) => {
    setFormData((prev) => {
      const next = [...(prev.variables || [])];
      next[index] = { ...next[index], [field]: value };
      if (field === "label") {
        next[index].slug = slugifyFormLabel(value);
      }
      return { ...prev, variables: next };
    });
  };

  const removeVariableRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      errorMessage("Please fill in template name, subject, and body");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      subject: formData.subject.trim(),
      body: formData.body.trim(),
      variables: (formData.variables || [])
        .filter((v) => v.label?.trim())
        .map((v) => ({
          label: v.label.trim(),
          slug: slugifyFormLabel(v.slug || v.label),
          sampleValue: v.sampleValue?.trim() || "",
        })),
    };

    try {
      const res = selectedTemplate
        ? await updateTemplate({ id: selectedTemplate.id, data: payload }).unwrap()
        : await createTemplate(payload).unwrap();

      if (res.success) {
        successMessage(res.message);
        onClose();
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this email template?")) return;

    try {
      const res = await deleteTemplate(id).unwrap();
      if (res.success) successMessage(res.message);
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to delete template");
    }
  };

  const handlePreview = async (template = null) => {
    const subject = template?.subject ?? formData.subject;
    const body = template?.body ?? formData.body;
    const templateVariables = template?.variables ?? formData.variables;

    if (!subject.trim() || !body.trim()) {
      errorMessage("Subject and body are required for preview");
      return;
    }

    try {
      const res = await previewTemplate({
        subject,
        body,
        templateVariables,
      }).unwrap();
      if (res.success) {
        setPreviewData(res.preview);
        onPreviewOpen();
      }
    } catch {
      const map = buildPreviewMapFromVariables(templateVariables);
      setPreviewData({
        subject: subject.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => map[k] ?? ""),
        body: body.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => map[k] ?? ""),
        variablesUsed: map,
      });
      onPreviewOpen();
    }
  };

  const openVariablesView = (template) => {
    setViewVariables(template.variables || []);
    onVariablesOpen();
  };

  const copyVariable = async (variable) => {
    try {
      await navigator.clipboard.writeText(variable);
      successMessage(`Copied ${variable}`);
    } catch {
      errorMessage("Could not copy to clipboard");
    }
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <DashHeading
          title="Email Templates"
          desc="Create templates and define variables for each one. Use {{variable_name}} in subject and body."
        />
        <Button
          color="success"
          startContent={<FiPlus />}
          onPress={() => handleOpen()}
          className="shadow-md"
        >
          New Template
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <p className="text-sm font-semibold text-[#06574C] mb-2">System variables (always available)</p>
        <div className="flex flex-wrap gap-2">
          {SYSTEM_TEMPLATE_VARIABLES.map((variable) => (
            <Chip
              key={variable}
              size="sm"
              variant="flat"
              color="success"
              className="cursor-pointer"
              onClick={() => copyVariable(variable)}
            >
              {variable}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Each template also has its own custom variables (Google Form columns). Add them inside the template editor.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" color="success" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <p className="text-gray-600 mb-4">No email templates yet.</p>
          <Button color="success" onPress={() => handleOpen()}>
            Create your first template
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[#06574C]">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  Subject: {template.subject}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {(template.variables || []).length} custom variable
                  {(template.variables || []).length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<FiList />}
                  onPress={() => openVariablesView(template)}
                >
                  Variables
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<FiEye />}
                  onPress={() => handlePreview(template)}
                  isLoading={isPreviewing}
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<FiEdit2 />}
                  onPress={() => handleOpen(template)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  startContent={<FiTrash2 />}
                  onPress={() => handleDelete(template.id)}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {selectedTemplate ? "Edit Email Template" : "Create Email Template"}
          </ModalHeader>
          <ModalBody className="space-y-6">
            <Input
              label="Template Name"
              labelPlacement="outside"
              placeholder="e.g. Ijazah Ghaibi Inquiry Confirmation"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              isRequired
            />
            <Input
              label="Subject Line"
              labelPlacement="outside"
              placeholder="e.g. Thank you for your inquiry — {{class_title}}"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              isRequired
            />
            <Textarea
              label="Email Body"
              labelPlacement="outside"
              placeholder="Assalamu alaikum {{name}}, thank you for your interest..."
              minRows={8}
              value={formData.body}
              onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
              isRequired
            />

            <div className="border border-[#95C4BE] rounded-lg p-4 bg-[#95C4BE11]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#06574C]">Template Variables</p>
                  <p className="text-xs text-gray-500">
                    Add Google Form columns for this template. Label becomes {"{{variable_slug}}"}.
                  </p>
                </div>
                <Button size="sm" color="success" variant="flat" onPress={addVariableRow}>
                  Add Variable
                </Button>
              </div>

              {variableRows.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No variables yet. Add form fields like &quot;Name&quot;, &quot;Phone number&quot;, etc.
                </p>
              ) : (
                <div className="space-y-3">
                  {variableRows.map((row, index) => (
                    <div
                      key={row.key}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end bg-white p-3 rounded-lg border"
                    >
                      <Input
                        className="sm:col-span-4"
                        size="sm"
                        label="Form column label"
                        labelPlacement="outside"
                        placeholder="e.g. Phone number"
                        value={row.label}
                        onChange={(e) => updateVariableRow(index, "label", e.target.value)}
                      />
                      <Input
                        className="sm:col-span-3"
                        size="sm"
                        label="Variable"
                        labelPlacement="outside"
                        value={row.slug ? `{{${row.slug}}}` : ""}
                        isReadOnly
                      />
                      <Input
                        className="sm:col-span-4"
                        size="sm"
                        label="Sample value (preview)"
                        labelPlacement="outside"
                        placeholder="Sample for preview"
                        value={row.sampleValue}
                        onChange={(e) => updateVariableRow(index, "sampleValue", e.target.value)}
                      />
                      <Button
                        className="sm:col-span-1"
                        size="sm"
                        color="danger"
                        variant="light"
                        isIconOnly
                        onPress={() => removeVariableRow(index)}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button variant="flat" onPress={() => handlePreview()} isLoading={isPreviewing}>
              Preview
            </Button>
            <Button color="success" onPress={handleSubmit} isLoading={isCreating || isUpdating}>
              {selectedTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View variables modal */}
      <Modal isOpen={isVariablesOpen} onClose={onVariablesClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Template Variables</ModalHeader>
          <ModalBody>
            {viewVariables.length === 0 ? (
              <p className="text-gray-500 text-sm">This template has no custom variables.</p>
            ) : (
              <Table aria-label="Template variables" removeWrapper>
                <TableHeader>
                  <TableColumn>Label</TableColumn>
                  <TableColumn>Variable</TableColumn>
                  <TableColumn>Sample</TableColumn>
                  <TableColumn width={60}>Copy</TableColumn>
                </TableHeader>
                <TableBody>
                  {viewVariables.map((row) => (
                    <TableRow key={row.slug}>
                      <TableCell className="text-sm">{row.label}</TableCell>
                      <TableCell>
                        <code className="text-xs text-[#06574C]">{`{{${row.slug}}}`}</code>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{row.sampleValue || "—"}</TableCell>
                      <TableCell>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => copyVariable(`{{${row.slug}}}`)}
                        >
                          <FiCopy size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onPress={onVariablesClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Preview modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Template Preview</ModalHeader>
          <ModalBody className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Subject</p>
              <p className="font-medium text-[#333]">{previewData.subject}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Body</p>
              <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-[#333]">
                {previewData.body}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onPress={onPreviewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EmailTemplates;
