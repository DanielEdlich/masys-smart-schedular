import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const availabilitySchema = z.object({
    day: z.number(),
    von: z.number(),
    bis: z.number(),
})

const formSchema = z.object({
        id: z.number().optional(),
        firstName: z.string({
            message: "Vorname darf nicht leer sein"
        }).min(1, {
            message: "Vorname darf nicht leer sein"
        }),
        lastName: z.string({
            message: "Nachname darf nicht leer sein"
        }).min(1, {
            message: "Nachname darf nicht leer sein"
        }),
        email: z.string({
            message: "E-Mail darf nicht leer sein"
        }).email(),
        phone: z.string({
            message: "Telefonnummer darf nicht leer sein"
        }),
        priority: z.number({
            required_error: "Priorität darf nicht leer sein"
        })
            .min(0, {
                message: "Priorität muss mindestens 1 sein."
            })
            .max(10, {
                message: "Priorität kann maximal 1 sein."
            }),
        availability: z.array(availabilitySchema).optional()
    }
)

export default function TeacherForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: undefined,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            priority: 0,
            availability: undefined
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // TODO - save to db
        console.log(values)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/*
                <FormField
                    control={form.control}
                    name="id"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>ID</FormLabel>
                            <FormControl>
                                <Input id="id" type="number" {...field} disabled/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                */}
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Vorname</FormLabel>
                            <FormControl>
                                <Input id="firstName" type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nachname</FormLabel>
                            <FormControl>
                                <Input id="lastName" type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>E-Mail</FormLabel>
                            <FormControl>
                                <Input id="email" type="email" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Telefonnummer</FormLabel>
                            <FormControl>
                                <Input id="phone" type="text" {...field} placeholder="030 1234 5678"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Priorität</FormLabel>
                            <FormControl>
                                <Input id="priority" type="number" {...field} placeholder="0" min="0" max="10"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="availability"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Verfügbarkeiten</FormLabel>
                            <FormControl>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Erstellen</Button>
            </form>
        </Form>
    )
}