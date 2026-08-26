import React, { useState } from "react";
import EntityListPage from "../../superadmin/EntityListPage";
import { expenseCategoriesApi } from "../../../services/endpoints/expenseCategories";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";

export default function ExpenseCategories() {
  const { user } = useAuth();
  const [seasonId, setSeasonId] = useState("");
  const [eventOrganizerId, setEventOrganizerId] = useState("");

  useEffect(() => {
    if (user.seasonId) setSeasonId(user.seasonId);
    if (user.id) setEventOrganizerId(user.id);
  }, [user]);

  return (
    <EntityListPage
      title="Expense Categories"
      icon="bi-tags"
      description="Global categories Event Organizers select from when filing an expense. Defined once here — not duplicated per organizer."
      api={expenseCategoriesApi}
      idField="id"
      searchKeys={["name", "description"]}
      // No PATCH /{id}/status is documented for this resource, so no
      // statusField/statusValues are passed — EntityListPage simply
      // won't render an activate/deactivate action for this screen.
      columns={[
        { key: "categoryName", label: "Category Name" },
        { key: "description", label: "Description" },
      ]}
      formFields={[
        {
          name: "categoryName",
          label: "Category Name",
          required: true,
          placeholder: "e.g. Decoration, Sound System, Prasad",
          col: "col-12",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          col: "col-12",
        },
      ]}
      emptyStateHint="No expense categories yet. Organizers can't file expenses until at least one exists."
      extraColumns={{
        seasonId: seasonId,
        eventOrganizerId: eventOrganizerId,
      }}

      listParams={{
        seasonId: seasonId,
        eventOrganizerId: eventOrganizerId,
      }}


    />
  );
}
