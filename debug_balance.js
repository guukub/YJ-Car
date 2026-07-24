const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const customers = await prisma.customer.findMany({ include: { jobs: true } }); 
  for (let c of customers) { 
    const totalSpent = c.jobs.reduce((sum, job) => sum + job.netPrice, 0); 
    const totalPaid = c.jobs.reduce((sum, job) => { 
      if ((job.amountPaid || 0) > 0) return sum + job.amountPaid; 
      if (job.paymentStatus === 'PAID') return sum + job.netPrice; 
      return sum; 
    }, 0); 
    const outstanding = Math.max(0, totalSpent - totalPaid); 
    if (outstanding > 0) { 
      console.log(c.name, outstanding); 
      console.log('PAID but amountPaid < netPrice:', c.jobs.filter(j => j.paymentStatus === 'PAID' && j.amountPaid < j.netPrice)); 
      console.log('Not PAID:', c.jobs.filter(j => j.paymentStatus !== 'PAID')); 
    } 
  } 
} 

main().finally(() => prisma.$disconnect());
