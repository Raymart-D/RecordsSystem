import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Record, insertRecordSchema, RECORD_CATEGORIES, RECORD_STATUSES } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface RecordFormProps {
  recordId?: number;
  onSuccess?: (record: Record) => void;
}

const RecordForm = ({ recordId, onSuccess }: RecordFormProps) => {
  const { toast } = useToast();
  const isEditing = !!recordId;

  // Extended schema with validation
  const formSchema = insertRecordSchema.extend({
    title: z.string().min(3, "Title must be at least 3 characters"),
    fileSize: z.number().optional(),
    tags: z.string().optional(),
  });

  // Get record data if editing
  const { data: recordData, isLoading } = useQuery({
    queryKey: [`/api/records/${recordId}`],
    enabled: isEditing,
  });

  // Set up form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "Form",
      status: "Active",
      fileType: "",
      fileSize: 0,
      content: "",
      tags: "",
      isFavorite: false,
    },
  });

  // When record data is loaded, update form values
  if (recordData && isEditing && !form.formState.isDirty) {
    form.reset({
      title: recordData.title,
      category: recordData.category,
      status: recordData.status,
      fileType: recordData.fileType || "",
      fileSize: recordData.fileSize || 0,
      content: recordData.content || "",
      tags: recordData.tags || "",
      isFavorite: recordData.isFavorite || false,
    });
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isEditing) {
        // Update existing record
        const response = await apiRequest("PATCH", `/api/records/${recordId}`, data);
        const updatedRecord = await response.json();
        
        toast({
          title: "Record updated",
          description: "The record has been successfully updated.",
        });
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["/api/records"] });
        queryClient.invalidateQueries({ queryKey: [`/api/records/${recordId}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        
        if (onSuccess) {
          onSuccess(updatedRecord);
        }
      } else {
        // Create new record
        const response = await apiRequest("POST", "/api/records", data);
        const newRecord = await response.json();
        
        toast({
          title: "Record created",
          description: "The new record has been successfully created.",
        });
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["/api/records"] });
        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        
        if (onSuccess) {
          onSuccess(newRecord);
        }
        
        // Reset form
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} record. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter record title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECORD_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECORD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fileType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Type</FormLabel>
                <FormControl>
                  <Input placeholder="PDF, DOCX, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Size (KB)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional content or notes about this record" 
                  className="h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags separated by commas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFavorite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mark as Favorite</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Favorite records will be highlighted and easily accessible
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Record" : "Create Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecordForm;
