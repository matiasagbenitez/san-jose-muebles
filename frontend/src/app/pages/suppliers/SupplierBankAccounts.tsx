import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";
import { LoadingSpinner } from "../../components";
import { ActionButtons, DatatableNoPagination } from "../../shared";
import { Button } from "react-bootstrap";
import { SupplierBankAccountForm } from "./components";

interface DataRow {
  id: number;
  id_supplier: string;
  id_bank: string;
  account_owner: string;
  cbu_cvu: string;
  alias: string;
  account_number: string;
  bank: string;
}

export interface BankAccountFormInterface {
  id_bank: string;
  account_owner?: string;
  cbu_cvu?: string;
  alias?: string;
  account_number: string;
}

const initialForm: BankAccountFormInterface = {
  id_bank: "",
  account_owner: "",
  cbu_cvu: "",
  alias: "",
  account_number: "",
};

enum ClipboardType {
  CBU_CVU = "cbu_cvu",
  ALIAS = "alias",
  ACCOUNT_NUMBER = "account_number",
}

export const SupplierBankAccounts = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BankAccountFormInterface>(initialForm);

  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await apiSJM.get(`/bank_accounts/supplier/${id}`);
      setBankAccounts(data.items);
      setSupplier(data.supplier);
      setLoading(false);
    } catch (error) {
      return navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleClick = (row: DataRow, type?: ClipboardType) => {
    switch (type) {
      case ClipboardType.CBU_CVU:
        navigator.clipboard.writeText(row.cbu_cvu);
        SweetAlert2.successToast("CBU/CVU copiado al portapapeles");
        break;
      case ClipboardType.ALIAS:
        navigator.clipboard.writeText(row.alias);
        SweetAlert2.successToast("Alias copiado al portapapeles");
        break;
      case ClipboardType.ACCOUNT_NUMBER:
        navigator.clipboard.writeText(row.account_number);
        SweetAlert2.successToast("Número de cuenta copiado al portapapeles");
        break;

      default:
        const text = `Banco: ${row.bank}\nTitular: ${row.account_owner}\nCBU/CVU: ${row.cbu_cvu}\nAlias: ${row.alias}\nN° de cuenta: ${row.account_number}`;
        navigator.clipboard.writeText(text);
        SweetAlert2.successToast("Datos copiados al portapapeles");
        break;
    }
  };

  const handleCreate = () => {
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (row: DataRow) => {
    setEditingId(row.id);
    setForm(row);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: BankAccountFormInterface) => {
    try {
      if (editingId) {
        const { data } = await apiSJM.put(
          `/bank_accounts/${editingId}`,
          values
        );
        SweetAlert2.successToast(data.message);
        handleHide();
      } else {
        const { data } = await apiSJM.post("/bank_accounts", {
          ...values,
          id_supplier: id,
        });
        SweetAlert2.successToast(data.message);
        handleHide();
      }
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const handleDelete = async (row: DataRow) => {
    const confirmation = await SweetAlert2.confirmationDialog(
      "¿Eliminar la cuenta bancaria " + row.bank + "?"
    );
    try {
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/bank_accounts/${row.id_bank}`);
        SweetAlert2.successToast("Cuenta bancaria eliminada");
        fetch();
      }
    } catch (error: any) {
      SweetAlert2.errorAlert(error);
    }
  };

  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row: DataRow) => row.id,
      width: "80px",
      center: true,
    },
    {
      name: "BANCO",
      selector: (row: DataRow) => row.bank,
      wrap: true,
    },
    {
      name: "TITULAR CUENTA",
      selector: (row: DataRow) => row.account_owner,
      wrap: true,
    },
    {
      name: "CBU/CVU",
      selector: (row: DataRow) => row.cbu_cvu,
      cell: (row: DataRow) => (
        <div className="d-flex align-items-center justify-content-between w-100">
          <span>{row.cbu_cvu}</span>
          <Button
            size="sm"
            variant="transparent"
            className="py-0 px-1"
            onClick={() => handleClick(row, ClipboardType.CBU_CVU)}
            title="Copiar CBU/CVU al portapapeles"
          >
            <i className="bi bi-clipboard"></i>
          </Button>
        </div>
      ),
    },
    {
      name: "ALIAS",
      selector: (row: DataRow) => row.alias,
      cell: (row: DataRow) => (
        <div className="d-flex align-items-center justify-content-between w-100">
          <span>{row.alias}</span>
          <Button
            size="sm"
            variant="transparent"
            className="py-0 px-1"
            onClick={() => handleClick(row, ClipboardType.ALIAS)}
            title="Copiar alias al portapapeles"
          >
            <i className="bi bi-clipboard"></i>
          </Button>
        </div>
      ),
    },
    {
      name: "N° DE CUENTA",
      selector: (row: DataRow) => row.account_number,
      cell: (row: DataRow) => (
        <div className="d-flex align-items-center justify-content-between w-100">
          <span>{row.account_number}</span>
          <Button
            size="sm"
            variant="transparent"
            className="py-0 px-1"
            onClick={() => handleClick(row, ClipboardType.ACCOUNT_NUMBER)}
            title="Copiar número de cuenta al portapapeles"
          >
            <i className="bi bi-clipboard"></i>
          </Button>
        </div>
      ),
    },
    {
      name: "ACCIONES",
      button: true,
      cell: (row: any) => (
        <>
          <Button
            size="sm"
            variant="transparent"
            className="py-0 px-1"
            onClick={() => handleClick(row)}
            title="Copiar datos al portapapeles"
          >
            <i className="bi bi-clipboard"></i>
          </Button>
          <ActionButtons
            row={row}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      ),
    },
  ];

  const handleHide = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {bankAccounts && !loading && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h1 className="fs-3">{supplier}</h1>
            <Button size="sm" variant="primary" onClick={handleCreate}>
              Agregar cuenta
            </Button>
          </div>

          <DatatableNoPagination
            title="Listado de cuentas bancarias del proveedor"
            columns={columns as TableColumn<DataRow>[]}
            data={bankAccounts}
            loading={loading}
          />

          <SupplierBankAccountForm
            show={isModalOpen}
            onHide={handleHide}
            form={form}
            editingId={editingId}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};
