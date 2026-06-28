import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button.jsx";
import { FieldShell, Input, Select, Textarea } from "../ui/Field.jsx";
import { toInputDate } from "../../utils/format.js";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed"];

const defaults = {
  title: "",
  description: "",
  category: "General",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaults,
    mode: "onBlur",
  });

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title || "",
        description: initial.description || "",
        category: initial.category || "General",
        priority: initial.priority || "Medium",
        status: initial.status || "Pending",
        dueDate: toInputDate(initial.dueDate),
      });
    } else {
      reset(defaults);
    }
  }, [initial, reset]);

  const description = watch("description") || "";

  const submit = async (values) => {
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate || null,
      };
      await onSubmit(payload);
    } catch (err) {
      toast.error(err.message || "Could not save task");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <FieldShell
        label="Title"
        required
        error={errors.title?.message}
      >
        <Input
          autoFocus
          placeholder="e.g. Draft Q3 launch plan"
          {...register("title", {
            required: "Title is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
            maxLength: { value: 80, message: "Maximum 80 characters" },
          })}
        />
      </FieldShell>

      <FieldShell
        label="Description"
        hint={`${description.length}/300`}
        error={errors.description?.message}
      >
        <Textarea
          rows={3}
          placeholder="Add more context (optional)"
          {...register("description", {
            maxLength: { value: 300, message: "Maximum 300 characters" },
          })}
        />
      </FieldShell>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldShell label="Category">
          <Input
            placeholder="General"
            {...register("category", { maxLength: 40 })}
          />
        </FieldShell>

        <FieldShell label="Due date">
          <Input type="date" {...register("dueDate")} />
        </FieldShell>

        <FieldShell label="Priority">
          <Select {...register("priority")}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FieldShell>

        <FieldShell label="Status">
          <Select {...register("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FieldShell>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initial ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
