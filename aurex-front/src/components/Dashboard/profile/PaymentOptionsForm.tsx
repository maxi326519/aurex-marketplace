import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { PaymentOption } from "../../../interfaces/PaymentOption";
import { useState } from "react";
import {
  CreditCard,
  Link as LinkIcon,
  Banknote,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  X,
} from "lucide-react";

import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";
import TextAreaInput from "../../ui/Inputs/Textarea";

interface PaymentOptionsFormProps {
  paymentOptions: PaymentOption[];
  loading: boolean;
  onCreateLink: (data: { link: string; pasarela: string }) => void;
  onCreateTransfer: (data: {
    cvu: string;
    cbu: string;
    otrosDatos: string;
  }) => void;
  onDeleteOption: (id: string) => void;
}

export default function PaymentOptionsForm({
  paymentOptions,
  loading,
  onCreateLink,
  onCreateTransfer,
  onDeleteOption,
}: PaymentOptionsFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<
    "link" | "transferencia"
  >("link");

  // Estados para formularios
  const [linkForm, setLinkForm] = useState({ link: "", pasarela: "" });
  const [transferForm, setTransferForm] = useState({
    cvu: "",
    cbu: "",
    otrosDatos: "",
  });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleCreateLink = () => {
    console.log("Creating link", linkForm);
    if (!linkForm.link) return;
    onCreateLink(linkForm);
    setLinkForm({ link: "", pasarela: "" });
    setShowAddForm(false);
  };

  const handleCreateTransfer = () => {
    if (!transferForm.cvu && !transferForm.cbu) return;
    onCreateTransfer(transferForm);
    setTransferForm({ cvu: "", cbu: "", otrosDatos: "" });
    setShowAddForm(false);
  };

  const handleAddNew = (type: "link" | "transferencia") => {
    setNewPaymentType(type);
    setShowAddForm(true);
  };

  const cancelAddForm = () => {
    setShowAddForm(false);
    setLinkForm({ link: "", pasarela: "" });
    setTransferForm({ cvu: "", cbu: "", otrosDatos: "" });
  };

  // Agrupar opciones por tipo
  const linkOptions = paymentOptions.filter((option) => option.type === "link");
  const transferOptions = paymentOptions.filter(
    (option) => option.type === "transferencia"
  );

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          Opciones de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sección de Links de Pago */}
        <div className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            onClick={() => toggleSection("links")}
          >
            <div className="flex items-center gap-2">
              <LinkIcon size={20} />
              <span className="font-medium">Pagos por Link</span>
              <span className="text-sm text-gray-500">
                ({linkOptions.length})
              </span>
            </div>
            {expandedSections.has("links") ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>

          {expandedSections.has("links") && (
            <div className="border-t p-4 space-y-3">
              {linkOptions.map((option) => (
                <div key={option.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Pasarela:</span>
                        <span className="text-sm text-gray-600">
                          {option.pasarela}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Link:</span>
                        <span className="text-sm text-gray-600 break-all">
                          {option.link}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="secondary"
                      variant="outline"
                      onClick={() => onDeleteOption(option.id!)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}

              {linkOptions.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No hay métodos de pago por link configurados
                </p>
              )}

              <Button
                type="primary"
                variant="outline"
                onClick={() => handleAddNew("link")}
                className="w-full"
              >
                <Plus size={16} />
                Agregar Pago por Link
              </Button>
            </div>
          )}
        </div>

        {/* Sección de Transferencias */}
        <div className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            onClick={() => toggleSection("transfers")}
          >
            <div className="flex items-center gap-2">
              <Banknote size={20} />
              <span className="font-medium">Transferencias Bancarias</span>
              <span className="text-sm text-gray-500">
                ({transferOptions.length})
              </span>
            </div>
            {expandedSections.has("transfers") ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>

          {expandedSections.has("transfers") && (
            <div className="border-t p-4 space-y-3">
              {transferOptions.map((option) => (
                <div key={option.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      {option.cvu && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">CVU:</span>
                          <span className="text-sm text-gray-600">
                            {option.cvu}
                          </span>
                        </div>
                      )}
                      {option.cbu && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">CBU:</span>
                          <span className="text-sm text-gray-600">
                            {option.cbu}
                          </span>
                        </div>
                      )}
                      {option.otrosDatos && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Otros datos:</span>
                          <span className="text-sm text-gray-600">
                            {option.otrosDatos}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      type="secondary"
                      variant="outline"
                      onClick={() => onDeleteOption(option.id!)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}

              {transferOptions.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No hay métodos de transferencia configurados
                </p>
              )}

              <Button
                type="primary"
                variant="outline"
                onClick={() => handleAddNew("transferencia")}
                className="w-full"
              >
                <Plus size={16} />
                Agregar Transferencia
              </Button>
            </div>
          )}
        </div>

        {/* Formulario para agregar nueva opción */}
        {showAddForm && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Agregar{" "}
                {newPaymentType === "link" ? "Pago por Link" : "Transferencia"}
              </h4>
              <Button
                type="secondary"
                variant="outline"
                onClick={cancelAddForm}
              >
                <X size={16} />
              </Button>
            </div>

            {newPaymentType === "link" ? (
              <div className="space-y-3">
                <Input
                  name="pasarela"
                  label="Pasarela de pago"
                  value={linkForm.pasarela}
                  onChange={(e) =>
                    setLinkForm((prev) => ({
                      ...prev,
                      pasarela: e.target.value,
                    }))
                  }
                />
                <Input
                  name="link"
                  label="Link de pago"
                  value={linkForm.link}
                  onChange={(e) =>
                    setLinkForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                />
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    onClick={handleCreateLink}
                    disabled={loading || !linkForm.link}
                    className="flex-1"
                  >
                    Agregar Link
                  </Button>
                  <Button
                    type="secondary"
                    variant="outline"
                    onClick={cancelAddForm}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    name="cvu"
                    label="CVU"
                    value={transferForm.cvu}
                    onChange={(e) =>
                      setTransferForm((prev) => ({
                        ...prev,
                        cvu: e.target.value,
                      }))
                    }
                  />
                  <Input
                    name="cbu"
                    label="CBU"
                    value={transferForm.cbu}
                    onChange={(e) =>
                      setTransferForm((prev) => ({
                        ...prev,
                        cbu: e.target.value,
                      }))
                    }
                  />
                </div>
                <TextAreaInput
                  name="otrosDatos"
                  label="Otros datos"
                  value={transferForm.otrosDatos}
                  onChange={(e) =>
                    setTransferForm((prev) => ({
                      ...prev,
                      otrosDatos: e.target.value,
                    }))
                  }
                />
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    onClick={handleCreateTransfer}
                    disabled={
                      loading || (!transferForm.cvu && !transferForm.cbu)
                    }
                    className="flex-1"
                  >
                    Agregar Transferencia
                  </Button>
                  <Button
                    type="secondary"
                    variant="outline"
                    onClick={cancelAddForm}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
