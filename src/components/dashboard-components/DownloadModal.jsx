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
  const images = [
    { img: "/images/download-1.jpeg" },
    { img: "/images/download-2.jpeg" },
    { img: "/images/download-3.jpeg" },
    { img: "/images/download-4.jpeg" },
    { img: "/images/download-5.jpeg" },
    { img: "/images/download-6.jpeg" },
    { img: "/images/download-7.jpeg" },
  ];
  return (
    <div>
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
        {isOpen === false ? (
          <Button
            variant="solid"
            size="lg"
            radius="sm"
            className="bg-[#06574c] text-white"
            onPress={onOpen}
          >
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
              <ModalBody className="my-6 overflow-visible">
                <div className="flex items-center justify-between">
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
                  <Button
                    variant="solid"
                    size="md"
                    radius="sm"
                    className="bg-[#06574c] text-white md:ml-3 max-sm:w-40"
                    onPress={handleInstall}
                  >
                    Download App
                  </Button>
                  {/* }  */}
                </div>

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
                        slidesPerView: 1,
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
                    className="mySwiper max-md:w-[200px]"
                  >
                    {images.map((item, index) => (
                      <SwiperSlide
                        className=" border-1 border-[#06574c] rounded-2xl object-cover "
                        key={index}
                      >
                        <Image
                        className="max-md:w-[200px] max-md:h-[500px] "
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
