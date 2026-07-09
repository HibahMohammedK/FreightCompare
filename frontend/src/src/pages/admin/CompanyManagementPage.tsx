import React, { useEffect, useState } from "react";
import { Card } from "../../components/shared/Card";
import { Button } from "../../components/shared/Button";
import { Input } from "../../components/shared/Input";
import { Modal } from "../../components/shared/Modal";
import { SearchIcon, Building2Icon } from "lucide-react";
import { ConfirmationDialog } from "../../components/shared/ConfirmationDialog";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompaniesByUrl,
  toggleCompanyStatus
} from "../../api/company";


interface Company {
  id: number;
  name: string;
  website?: string;
  created_at?: string;
  is_active: boolean;
}

export const  CompanyManagementPage: React.FC = () => {

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch,setDebouncedSearch] = useState(search);
  const [nextPage,setNextPage] = useState<string|null>(null);
  const [prevPage,setPrevPage] = useState<string|null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] =
    useState<Company | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    website: "",
  });

  const [form, setForm] = useState({
    name: "",
    website: ""
  });

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [companyToDelete, setCompanyToDelete] =
    useState<Company | null>(null);

  const [companyToToggle, setCompanyToToggle] =
    useState<Company | null>(null);

  const fetchCompanies = async (
    url?: string
    ) => {

    try {

    const res = url
        ? await getCompaniesByUrl(url)
        : await getCompanies(
            debouncedSearch
        );

    setCompanies(
        res.data.results || []
    );

    setNextPage(
        res.data.next
    );

    setPrevPage(
        res.data.previous
    );

    } catch(err) {

    console.error(err);

    } finally {

    setLoading(false);

    }

    };

useEffect(() => {

 const timer =
   setTimeout(() => {

    setDebouncedSearch(
      search
    );

   }, 400);

 return () =>
   clearTimeout(timer);

}, [search]);

useEffect(() => {
 fetchCompanies();
}, [debouncedSearch]);


  const openCreateModal = () => {

    setEditingCompany(null);

    setForm({
      name: "",
      website: ""
    });
    setErrors({
    name: "",
    website: "",
  });

    setShowModal(true);
  };


  const openEditModal = (
    company: Company
  ) => {

    setEditingCompany(company);

    setForm({
      name: company.name || "",
      website: company.website || ""
    });
    setErrors({
      name: "",
      website: "",
    });

    setShowModal(true);
  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      if (editingCompany) {

        await updateCompany(
          editingCompany.id,
          form
        );  
        showToast("Company updated successfully.");

      } else {

        await createCompany(form);
        showToast("Company created successfully.");

      }

      setShowModal(false);

      setForm({
        name: "",
        website: ""
      });

      fetchCompanies();

    } catch (err: any) {
      const backendErrors = err.response?.data;

      setErrors({
        name: backendErrors?.name?.[0] || "",
        website: backendErrors?.website?.[0] || "",
      });

      if (!backendErrors?.name && !backendErrors?.website) {
        showToast(
          "Failed to save company.",
          "error"
        );
      }
    }
  };


  const handleDelete = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete.id);

      showToast("Company deleted successfully.");

      setCompanyToDelete(null);

      fetchCompanies();
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to delete company.",
        "error"
      );
    }
  };

  const handleToggleStatus = async () => {
    if (!companyToToggle) return;

    try {
      await toggleCompanyStatus(companyToToggle.id);

      showToast("Company status updated.");

      setCompanyToToggle(null);

      fetchCompanies();
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to update company status.",
        "error"
      );
    }
  }


  if (loading) {

    return (
      <div className="p-8">
        Loading companies...
      </div>
    );
  }


  return (
    <div className="flex-1 overflow-y-auto p-8">

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-white shadow-lg
            ${
              toast.type === "error"
                ? "bg-red-500"
                : "bg-green-600"
            }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-dark">
          Company Management
        </h1>

        <p className="text-sm text-text-light">
          Manage logistics companies.
        </p>
      </div>


      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex-1">
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              icon={<SearchIcon size={18} />}
            />
          </div>


          <div className="w-full md:w-48">
            <Button
              fullWidth
              onClick={openCreateModal}
            >
              + Add Company
            </Button>
          </div>

        </div>
      </Card>


      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-bg-light border-b border-border-light">

                <th className="p-4 text-xs font-semibold uppercase">
                  Company
                </th>

                <th className="p-4 text-xs font-semibold uppercase">
                  Website
                </th>

                <th className="p-4 text-xs font-semibold uppercase">
                  Created
                </th>

                <th className="p-4 text-xs font-semibold uppercase">
                  Status
                </th>

                <th className="p-4 text-xs font-semibold uppercase text-right">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-border-light">

              {companies.map((company) => (

                <tr
                  key={company.id}
                  className="hover:bg-bg-light/50"
                >

                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                        <Building2Icon size={18} />
                      </div>

                      <span className="font-medium text-text-dark">
                        {company.name}
                      </span>

                    </div>
                  </td>


                  <td className="p-4 text-sm text-text-medium">
                    {company.website || "-"}
                  </td>


                  <td className="p-4 text-sm text-text-medium">
                    {
                      company.created_at
                        ? new Date(
                            company.created_at
                          ).toLocaleDateString()
                        : "-"
                    }
                  </td>

                  <td className="p-4 text-sm text-text-medium">
                      <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        company.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {
                        company.is_active
                          ? "Active"
                          : "Disabled"
                      }
                    </span>
                  </td>


                  <td className="p-4 text-right space-x-2">

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        openEditModal(company)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setCompanyToToggle(company)
                      }
                    >
                      {
                        company.is_active
                          ? "Disable"
                          : "Enable"
                      }
                    </Button>


                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setCompanyToDelete(company)
                      }
                    >
                      Delete
                    </Button>

                  </td>

                </tr>

              ))}


              {companies.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-text-light"
                  >
                    No companies found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
            <div className="flex justify-between p-4">
                <Button
                    disabled={!prevPage}
                    onClick={() =>
                    prevPage &&
                    fetchCompanies(prevPage)
                    }
                    >
                    Previous
                </Button>

                <Button
                    disabled={!nextPage}
                    onClick={() =>
                    nextPage &&
                    fetchCompanies(nextPage)
                    }
                    >
                    Next
                </Button>
            </div>
        </div>
      </Card>


      <Modal
        isOpen={showModal}
        onClose={() =>
          setShowModal(false)
        }
        title={
          editingCompany
            ? "Edit Company"
            : "Add Company"
        }
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <Input
            label="Company Name"
            value={form.name}
            onChange={(e) => {
              setForm({
                ...form,
                name: e.target.value,
              });

              setErrors((prev) => ({
                ...prev,
                name: "",
              }));
            }}
            error={errors.name}
            required
          />


          <Input
            label="Website"
            value={form.website}
            onChange={(e) => {
              setForm({
                ...form,
                website: e.target.value
              });

              setErrors((prev) => ({
                ...prev,
                website: "",
              }));
              
            }}
            error={errors.website}
            placeholder="https://example.com"
          />


          <Button
            type="submit"
            fullWidth
          >
            {
              editingCompany
                ? "Save Changes"
                : "Add Company"
            }
          </Button>

        </form>

      </Modal>

      <ConfirmationDialog
        isOpen={!!companyToDelete}
        title="Delete Company"
        message={`Are you sure you want to permanently delete "${companyToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleDelete}
      />

      <ConfirmationDialog
        isOpen={!!companyToToggle}
        title={
          companyToToggle?.is_active
            ? "Disable Company"
            : "Enable Company"
        }
        message={
          companyToToggle?.is_active
            ? `Are you sure you want to disable "${companyToToggle?.name}"?`
            : `Are you sure you want to enable "${companyToToggle?.name}"?`
        }
        confirmText={
          companyToToggle?.is_active
            ? "Disable"
            : "Enable"
        }
        confirmVariant={
          companyToToggle?.is_active
            ? "danger"
            : "primary"
        }
        onClose={() => setCompanyToToggle(null)}
        onConfirm={handleToggleStatus}
      />

    </div>
  );

};

