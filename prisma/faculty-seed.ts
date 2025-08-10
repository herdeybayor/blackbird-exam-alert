import prisma from "@/lib/prisma";

async function main() {
    const faculties = [
        {
            name: "Faculty of Science",
        },
        {
            name: "Faculty of Arts",
        },
        {
            name: "Faculty of Education",
        },
    ];

    for (const faculty of faculties) {
        try {
            console.log(`Seeding faculty: ${faculty.name}`);
            const existingFaculty = await prisma.faculty.findFirst({
                where: { name: faculty.name },
            });

            if (!existingFaculty) {
                await prisma.faculty.create({ data: faculty });
                console.log(`Faculty ${faculty.name} seeded successfully`);
            } else {
                console.log(`Faculty ${faculty.name} already exists`);
            }
        } catch (error) {
            console.error("Error seeding faculties:", error);
        }
    }

    console.log("Faculties seeded successfully");
}

main();
