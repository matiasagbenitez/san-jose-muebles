import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import apiSJM from "../../../api/apiSJM";
import { SweetAlert2 } from "../../utils";
import { LoadingSpinner, PageHeader } from "../../components";
import { ActionButtons, DatatableNoPagination } from "../../shared";
import { Button } from "react-bootstrap";
import { SupplierBankAccountForm } from "./components";

import { CopyToClipboard } from "react-copy-to-clipboard";

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
  ALL = "all",
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

  const showAlert = async (type: ClipboardType) => {
    let message = "";
    switch (type) {
      case ClipboardType.CBU_CVU:
        message = "¡CBU/CVU copiado al portapapeles!";
        break;
      case ClipboardType.ALIAS:
        message = "¡Alias copiado al portapapeles!";
        break;
      case ClipboardType.ALL:
        message = "¡Datos copiados al portapapeles!";
        break;
    }
    SweetAlert2.successToast(message);
  };

  const CopyElement = (type: ClipboardType, row: DataRow) => {
    let text = "";
    switch (type) {
      case ClipboardType.CBU_CVU:
        text = row.cbu_cvu;
        break;
      case ClipboardType.ALIAS:
        text = row.alias;
        break;
      case ClipboardType.ALL:
        text = `Banco: ${row.bank}\nTitular: ${row.account_owner}\nCBU/CVU: ${row.cbu_cvu}\nAlias: ${row.alias}\nN° de cuenta: ${row.account_number}`;
        break;
    }

    return (
      <CopyToClipboard text={text} onCopy={() => showAlert(type)}>
        <Button size="sm" variant="transparent" className="py-0 px-1">
          <span>{type === ClipboardType.ALL ? "" : text}</span>
          <i className="bi bi-clipboard ms-2 small text-muted"></i>
        </Button>
      </CopyToClipboard>
    );
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
        const confirmation = await SweetAlert2.confirm(
          "¿Actualizar cuenta bancaria?"
        );
        if (!confirmation.isConfirmed) return;
        const { data } = await apiSJM.put(
          `/bank_accounts/${editingId}`,
          values
        );
        SweetAlert2.successToast(data.message);
      } else {
        const confirmation = await SweetAlert2.confirm(
          "¿Agregar cuenta bancaria?"
        );
        if (!confirmation.isConfirmed) return;
        const { data } = await apiSJM.post("/bank_accounts", {
          ...values,
          id_supplier: id,
        });
        SweetAlert2.successToast(data.message);
      }
      handleHide();
      fetch();
    } catch (error: any) {
      SweetAlert2.errorAlert(error.response.data.message);
    }
  };

  const handleDelete = async (row: DataRow) => {
    const confirmation = await SweetAlert2.confirm(
      "¿Eliminar la cuenta bancaria " + row.bank + "?"
    );
    try {
      if (confirmation.isConfirmed) {
        await apiSJM.delete(`/bank_accounts/${row.id}`);
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
      maxWidth: "180px",
    },
    {
      name: "TITULAR CUENTA",
      selector: (row: DataRow) => row.account_owner,
      maxWidth: "180px",
    },
    {
      name: "CBU/CVU",
      selector: (row: DataRow) => row.cbu_cvu,
      cell: (row: DataRow) => (
        <>{row.cbu_cvu && CopyElement(ClipboardType.CBU_CVU, row)}</>
      ),
    },
    {
      name: "ALIAS",
      selector: (row: DataRow) => row.alias,
      cell: (row: DataRow) => (
        <>{row.alias && CopyElement(ClipboardType.ALIAS, row)}</>
      ),
    },
    {
      name: "N° DE CUENTA",
      selector: (row: DataRow) => row.account_number,
      maxWidth: "180px",
    },
    {
      name: "ACCIONES",
      button: true,
      width: "150px",
      cell: (row: any) => (
        <>
          {CopyElement(ClipboardType.ALL, row)}
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
      {bankAccounts && !loading && supplier && (
        <>
          <PageHeader
            goBackTo={`/proveedores/${id}`}
            goBackTitle="Volver al detalle del proveedor"
            title="Listado de cuentas bancarias"
            handleAction={handleCreate}
            actionButtonText="Nueva cuenta"
            hr={false}
            className="mb-0 mb-lg-3"
          />

          <DatatableNoPagination
            title={`Cuentas bancarias del proveedor ${supplier}`}
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
