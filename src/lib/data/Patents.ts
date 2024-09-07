import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(year?: string) {

    if (!year) {
        year = '2024';
    }
	const theDatabase = await prisma.patents.findMany({
		where: {
			year: year
		}
	});

	console.log(theDatabase);
}

export {main}