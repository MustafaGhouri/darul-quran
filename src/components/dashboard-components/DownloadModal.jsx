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
  Image,
} from "@heroui/react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useLocation } from "react-router-dom";

const DownloadModal = () => {
  const location = useLocation()
  const appearButton = location.pathname === "/";
  const [installPrompt, setInstallPrompt] = useState(null);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop auto prompt
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const isIos = () => {
    return /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase()
    );
  };

  const isSafari = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return (
      ua.includes("safari") &&
      !ua.includes("chrome") &&
      !ua.includes("crios") &&
      !ua.includes("fxios")
    );
  };

  const isInStandaloneMode = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator).standalone === true
    );
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      console.log("User choice:", result.outcome);
      setInstallPrompt(null);
    } else if (isIos() && !isInStandaloneMode()) {
      alert(
        "To install this app on your iPhone, tap the Share icon and select 'Add to Home Screen'."
      );
    } else {
      alert("Already Installed OR Try Again Later");
    }
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [modalPlacement, setModalPlacement] = useState("auto");
  const images = [
    { img: "/images/download-1.png" },
    { img: "/images/download-2.png" },
    { img: "/images/download-3.png" },
    { img: "/images/download-4.png" },
    { img: "/images/download-5.png" },
    { img: "/images/download-6.png" },
    { img: "/images/download-7.png" },
  ];
  const shouldShowIosInstallModal = () => {
    return (
      isIos() &&
      isSafari() &&
      !isInStandaloneMode()
    );
  };
  return (
    <div>
      {appearButton && installPrompt && !isSafari() && <div
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
        }}>
        <Button
          variant="solid"
          size="md"
          radius="sm"
          className="bg-[#06574c] text-white md:ml-3 max-sm:w-40"
          onPress={handleInstall}
        >
          Download App
        </Button>
      </div>}
      {!isOpen && appearButton && !shouldShowIosInstallModal() && isSafari() && <div
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
        <Button
          variant="solid"
          size="lg"
          radius="sm"
          className="bg-[#06574c] text-white"
          onPress={onOpen}
        >
          Install App
        </Button>
      </div>}
      <Modal
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}
        scrollBehavior={'outside'}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex mr-4 items-center justify-between">
                <h1 className="text-3xl font-bold ">Darul Quran</h1>
                <Button
                  size="lg"
                  radius="sm"
                  color="danger"
                  variant="flat"
                  className="hidden "
                  onPress={onClose}
                >
                  Close
                </Button>
                {/* {installPrompt &&  */}
                {/* <Button
                  variant="bordered"
                  size="sm"
                  color="success"
                  radius="sm"
                  onPress={handleInstall}
                >
                 Install
                </Button> */}
              </ModalHeader>
              <ModalBody className="my-6 onverflow-visible">
                To install this app on your iPhone, tap the Share icon and select 'Add to Home Screen'.
                <div className="my-6  ">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    loop={true}
                    // modules={[Pagination]}
                    breakpoints={{
                      0: {
                        slidesPerView: 2,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper maxhbj-md:w-[200px]"
                  >
                    {images.map((item, index) => (
                      <SwiperSlide
                        className=" border-1 border-[#06574c] rounded-2xl object-cover "
                        key={index}
                      >
                        <Image
                          src={item.img} alt="image" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DownloadModal;
