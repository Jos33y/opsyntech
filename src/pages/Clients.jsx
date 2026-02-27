import { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientForm } from '../components/clients/ClientForm';
import { Button } from '../components/common/Button';
import { Modal, ModalFooter } from '../components/common/Modal';
import { ContentLoader } from '../components/common/Loader';
import { useToast } from '../components/common/Toast';

export default function Clients() {
    const { clients, loading, searchClients, createClient, updateClient, deleteClient } = useClients();
    const toast = useToast();

    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const filteredClients = searchClients(search);

    const handleAdd = () => {
        setEditingClient(null);
        setShowForm(true);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            if (editingClient) {
                await updateClient(editingClient.id, formData);
                toast.success('Client updated');
            } else {
                await createClient(formData);
                toast.success('Client added');
            }
            setShowForm(false);
            setEditingClient(null);
        } catch (error) {
            toast.error(editingClient ? 'Failed to update client' : 'Failed to add client');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (id) => setDeleteId(id);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteClient(deleteId);
            toast.success('Client deleted');
            setDeleteId(null);
        } catch (error) {
            toast.error('Failed to delete client');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <ContentLoader />;
    }

    return (
        <div className="clients-page">
            {/* Header */}
            <header className="clients-page__header">
                <div className="clients-page__title-group">
                    <h1 className="clients-page__title">Clients</h1>
                    <p className="clients-page__subtitle">
                        {clients.length} total client{clients.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button onClick={handleAdd}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Client
                </Button>
            </header>

            {/* Search */}
            <div className="clients-search">
                <svg className="clients-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                    type="text"
                    className="clients-search__input"
                    placeholder="Search clients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Client Grid */}
            <div className="clients-grid">
                {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))
                ) : (
                    <div className="clients-empty">
                        <div className="clients-empty__illustration">
                            <svg className="clients-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                        </div>
                        {clients.length === 0 ? (
                            <>
                                <h2 className="clients-empty__title">Add your first client</h2>
                                <p className="clients-empty__text">
                                    Keep track of your clients and easily add them to invoices
                                </p>
                                <Button onClick={handleAdd}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19"/>
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                    Add Client
                                </Button>
                            </>
                        ) : (
                            <>
                                <h2 className="clients-empty__title">No clients found</h2>
                                <p className="clients-empty__text">
                                    Try adjusting your search
                                </p>
                                <Button variant="secondary" onClick={() => setSearch('')}>
                                    Clear Search
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditingClient(null); }}
                title={editingClient ? 'Edit Client' : 'Add Client'}
                size="md"
            >
                <ClientForm
                    initialData={editingClient}
                    onSubmit={handleSubmit}
                    onCancel={() => { setShowForm(false); setEditingClient(null); }}
                    loading={submitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Client"
                size="sm"
            >
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Are you sure? Their invoices will remain but won't be linked.
                </p>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>Delete</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}