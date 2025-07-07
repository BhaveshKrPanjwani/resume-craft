import { Button, message, Input, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useResumeStore from "../../stores/useResumeStore";
import { useState } from "react";
 

const SectionAdder = () => {
  const { resumeMetadata, updateResumeMetadata } = useResumeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const showModal = () => {
    setNewSectionName("");
    setModalVisible(true);
  };

  const handleAddSection = () => {
    const trimmed = newSectionName.trim();
    const key = trimmed.toLowerCase().replace(/\s+/g, "_");

    if (!trimmed) {
      message.warning("Section name cannot be empty.");
      return;
    }

    if (resumeMetadata.sectionOrder.includes(key)) {
      message.warning("This section already exists.");
      return;
    }

    const newOrder = [...resumeMetadata.sectionOrder, key];
    updateResumeMetadata({ sectionOrder: newOrder });
    message.success(`"${trimmed}" section added`);
    setModalVisible(false);
  };

  return (
    <>
      <Button type="dashed" icon={<PlusOutlined />} onClick={showModal}>
        Add Custom Section
      </Button>

      <Modal
        title="Create a Custom Section"
        open={modalVisible}
        onOk={handleAddSection}
        onCancel={() => setModalVisible(false)}
        okText="Add Section"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter section name (e.g., Hobbies, Awards)"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          onPressEnter={handleAddSection}
        />
      </Modal>
    </>
  );
};

export default SectionAdder;
