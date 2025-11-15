"use client";

import { useState } from "react";
import AddPlantModal from "./AddPlantForm";
import PlantList from "./PlantList";
import Sidebar from "../comp/Sidebar";
import { Icon } from "@iconify/react";

export default function InventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePlantAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for large screen */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white z-50 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between bg-white shadow-sm px-4 py-3 lg:py-5 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-green-700 lg:hidden"
          >
            <Icon icon="lucide:menu" className="w-7 h-7" />
          </button>

          <h1 className="text-lg lg:text-2xl font-bold text-green-700 text-center flex-1 lg:flex-none">
            🌿 Nursery Inventory Management
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="hidden lg:flex bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md items-center gap-2"
          >
            <Icon icon="lucide:plus" />
            Add Plant
          </button>
        </div>

        {/* Mobile Add Button */}
        <div className="flex justify-center mt-4 mb-2 lg:hidden">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <Icon icon="lucide:plus" />
            Add Plant
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {showModal && (
            <AddPlantModal
              onClose={() => setShowModal(false)}
              onPlantAdded={handlePlantAdded}
            />
          )}

          <PlantList refresh={refresh} />
        </div>
      </div>
    </div>
  );
}
