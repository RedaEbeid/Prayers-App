import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function Prayer ({name, time, img}) {
  return (
    <Card sx={{ width:'15vw' }} className='stack'>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={img}
      />
      <CardContent>
        <h2 style={{textAlign:'center'}}> {name} </h2>
        <Typography variant="h2" color="text.secondary" style={{direction:'ltr', display:'flex', justifyContent:'center'}}> {time} </Typography>
      </CardContent>
    </Card>
  );
}