import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@heroui/react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect, useState } from "react";
const DownloadModal = () => {
  const appearButton = window.location.pathname === "/";
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop auto prompt
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;
    console.log(result.outcome); // accepted / dismissed

    setInstallPrompt(null);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [modalPlacement, setModalPlacement] = useState("auto");
  return (
    <div>
      {/* {appearButton && installPrompt ? ( */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "transparent",
          color: "transparent",
          padding: "12px",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {/* <Button variant="solid" size="lg" radius="sm" className="bg-[#06574c] text-white" style={{ marginLeft: "10px" }} 
          onPress={handleInstall}
          >
            Download App
          </Button> */}
        {isOpen === false ? (
          <Button color="primary" onPress={onOpen}>
            Open Modal
          </Button>
        ) : (
          ""
        )}
      </div>
      {/* ) : (
        ""
      )}  */}
      <Modal
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="my-6">
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="lg"
                  radius="sm"
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                {installPrompt && 
                <Button
                  variant="solid"
                  size="lg"
                  radius="sm"
                  className="bg-[#06574c] text-white"
                  style={{ marginLeft: "10px" }}
                  onPress={handleInstall}
                >
                  Download App
                </Button>
                 } 
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DownloadModal;
